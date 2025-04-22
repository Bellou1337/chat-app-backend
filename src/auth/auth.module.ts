import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
