import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from 'src/shared/enums';
import { UserStatus } from 'src/shared/enums';
import { hashPassword } from 'src/shared/utils/password.utils';
import { UserDTO } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

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
        role: UserRole.USER,
        status: UserStatus.OFFLINE,
      },
    });

    return { message: 'User created' };
  }

  async findOne(username: string): Promise<UserDTO | undefined> {
    const user = (await this.prismaService.users.findUnique({
      where: {
        username: username,
      },
    })) as UserDTO;
    return user;
  }
}
