import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserDTO } from 'src/users/dto';
import { comparePasswords } from 'src/shared/utils/password.utils';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async signIn(userData: LoginUserDTO): Promise<Record<string, any>> {
    const user = await this.usersService.findOne(userData.username);

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
}
