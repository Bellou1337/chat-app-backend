import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserDTO } from 'src/users/dto';
import { comparePasswords } from 'src/shared/utils/password.utils';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractTokenFromHeader } from 'src/shared/utils/token.utils';
import { TokenService } from './token/token.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(userData: LoginUserDTO): Promise<Record<string, any>> {
    const user = await this.usersService.findOne(userData.login);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await comparePasswords(userData.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.role, username: user.username };
    const accessToken = await this.jwtService.sign(payload);
    const refreshToken = await this.jwtService.sign(
      { username: user.username },
      { expiresIn: '7d' },
    );

    await this.prismaService.users.update({
      data: {
        status: 'ONLINE',
        refreshToken: refreshToken,
      },
      where: {
        username: user.username,
      },
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<Record<string, string>> {
    const user = await this.prismaService.users.findUnique({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const payload = { sub: user.role, username: user.username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken: accessToken };
  }

  async logout(req: Request): Promise<Record<string, string>> {
    const token = extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      await this.tokenService.invalidateToken(token);

      const payload = await this.jwtService.verifyAsync(token);
      const username = payload.username;

      await this.prismaService.users.updateMany({
        where: {
          username: username,
        },
        data: {
          status: 'OFFLINE',
          refreshToken: null,
        },
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return { message: 'Logout successful' };
  }
}
