import { Controller, Get, Request, UseGuards, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserDTO } from './dto/user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { API_RESPONSES } from 'src/shared/swagger/api-responses';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user' })
  @HttpCode(200)
  @ApiResponse(API_RESPONSES.CURRENT_USER)
  @ApiResponse(API_RESPONSES.USER_NOT_FOUND)
  @Get('/me')
  async getCurrentUser(@Request() req): Promise<UserDTO> {
    return await this.userService.findCurrentUser(req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user by username' })
  @HttpCode(200)
  @ApiResponse(API_RESPONSES.USER_FOUND)
  @ApiResponse(API_RESPONSES.USER_NOT_FOUND)
  @Get('/:username')
  async getUserByUsername(@Query('username') username: string): Promise<UserDTO> {
    return await this.userService.findUserByUsername(username);
  }
}
