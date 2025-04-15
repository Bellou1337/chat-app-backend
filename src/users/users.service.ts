import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from 'src/shared/enums';
import { UserStatus } from 'src/shared/enums';
import { hashPassword, comparePasswords } from 'src/shared/utils/password.utils';
import { UserDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { extractTokenFromHeader } from 'src/shared/utils/token.utils';
import { Request } from 'express';
import { TokenService } from 'src/auth/token/token.service';
import { JwtUser } from 'src/shared/interfaces/jwt-user.interface';
import { UpdateUserEmailDTO } from './dto/update-user-email.dto';
import { SmtpService } from 'src/smtp/smtp.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly smtpService: SmtpService,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<Record<string, string>> {
    const { username, password } = createUserDTO;
    const user = await this.prismaService.users.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    await this.prismaService.users.create({
      data: {
        username: username,
        password: hashedPassword,
        email: createUserDTO.email,
        role: UserRole.USER,
        status: UserStatus.OFFLINE,
      },
    });

    return { message: 'User created' };
  }

  async findOne(login: string): Promise<UserDTO | undefined> {
    const user = (await this.prismaService.users.findFirst({
      where: {
        OR: [{ username: login }, { email: login }],
      },
    })) as UserDTO;
    return user;
  }

  async findCurrentUser(req: Request): Promise<UserDTO> {
    const token = extractTokenFromHeader(req);
    const payload = await this.jwtService.verifyAsync(token!);
    const user = (await this.prismaService.users.findUnique({
      where: {
        username: payload.username,
      },
      select: {
        username: true,
        email: true,
        role: true,
        status: true,
        refreshToken: true,
      },
    })) as UserDTO;
    if (!user) {
      throw new ConflictException('User not found');
    }

    return user as UserDTO;
  }

  async findUserByUsername(username: string): Promise<UserDTO> {
    const user = (await this.prismaService.users.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
        email: true,
        role: true,
        status: true,
        refreshToken: true,
      },
    })) as UserDTO;
    if (!user) {
      throw new ConflictException('User not found');
    }
    return user;
  }

  async deleteUserByUsername(username: string): Promise<Record<string, string>> {
    const user = (await this.prismaService.users.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
        email: true,
        role: true,
        status: true,
        refreshToken: true,
      },
    })) as UserDTO;

    if (!user) {
      throw new ConflictException('User not found');
    }

    await this.prismaService.users.delete({
      where: {
        username: username,
      },
    });
    return { message: 'User deleted' };
  }

  async updateUserPassword(
    username: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<Record<string, string>> {
    const user = (await this.prismaService.users.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
        role: true,
        email: true,
        status: true,
        refreshToken: true,
        password: true,
      },
    })) as UserDTO;

    if (!user) {
      throw new ConflictException('User not found');
    }

    const isCorrectPassword = await comparePasswords(currentPassword, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newHashedPassword = await hashPassword(newPassword);

    await this.prismaService.users.update({
      where: {
        username: username,
      },
      data: {
        password: newHashedPassword,
      },
    });
    try {
      await this.smtpService.sendPasswordChanged(user.email, user.username);
    } catch (error) {
      Logger.error('Error sending email' + error.message);
    }

    return { message: 'User password updated' };
  }

  async updateUserUsername(
    currentUsername: string,
    newUsername: string,
    req: Request,
  ): Promise<Record<string, string>> {
    if (currentUsername === newUsername) {
      throw new ConflictException('New username is the same as current username');
    }

    const user = (await this.prismaService.users.findUnique({
      where: {
        username: currentUsername,
      },
      select: {
        username: true,
        email: true,
        role: true,
        status: true,
        refreshToken: true,
      },
    })) as UserDTO;

    if (!user) {
      throw new ConflictException('User not found');
    }

    await this.prismaService.users.update({
      where: {
        username: currentUsername,
      },
      data: {
        username: newUsername,
      },
    });

    const jwtData = req.user as JwtUser;
    const payload = { sub: jwtData.sub, username: newUsername };
    const newAccessToken = this.jwtService.sign(payload);
    const oldToken = extractTokenFromHeader(req);
    await this.tokenService.invalidateToken(oldToken!);

    return { message: 'User username updated', accessToken: newAccessToken };
  }

  async updateUserEmail(userData: UpdateUserEmailDTO): Promise<Record<string, string>> {
    const user = (await this.prismaService.users.findUnique({
      where: {
        username: userData.username,
      },
      select: {
        username: true,
        email: true,
        role: true,
        status: true,
        refreshToken: true,
      },
    })) as UserDTO;

    if (!user) {
      throw new ConflictException('User not found');
    }
    if (user.email !== userData.currentEmail) {
      throw new UnauthorizedException('Current email is incorrect');
    }

    if (userData.currentEmail === userData.newEmail) {
      throw new ConflictException('New email is the same as current email');
    }

    await this.prismaService.users.update({
      where: {
        username: userData.username,
      },
      data: {
        email: userData.newEmail,
      },
    });

    try {
      await this.smtpService.sendEmailChanged(userData.newEmail, user.username);
    } catch (error) {
      Logger.error('Error sending email' + error.message);
    }

    return { message: 'User email updated' };
  }
}
