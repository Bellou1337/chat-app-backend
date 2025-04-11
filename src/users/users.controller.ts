import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserDTO } from './dto/user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('/me')
  async getCurrentUser(@Request() req): Promise<UserDTO> {
    return await this.userService.findCurrentUser(req);
  }
}
