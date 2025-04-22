import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { TokenModule } from 'src/auth/token/token.module';
import { SmtpModule } from 'src/smtp/smtp.module';

@Module({
  imports: [PrismaModule, TokenModule, SmtpModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
