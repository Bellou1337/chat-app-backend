import {
  Controller,
  Get,
  Request,
  UseGuards,
  HttpCode,
  Query,
  Delete,
  Body,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UserDTO } from './dto/user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { API_RESPONSES } from 'src/shared/swagger/api-responses';
import { SelfActionGuard } from './self-action.guard';
import { UpdateUserPasswordDTO } from './dto/update-user-password.dto';
import { UpdateUserUsernameDTO } from './dto/update-user-username.dto';
import { UpdateUserEmailDTO } from './dto/update-user-email.dto';

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

  @UseGuards(JwtAuthGuard, SelfActionGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete user by username' })
  @ApiResponse(API_RESPONSES.USER_DELETED)
  @ApiResponse(API_RESPONSES.USER_NOT_FOUND)
  @HttpCode(200)
  @Delete('/:username')
  async deleteUserByUsername(@Query('username') username: string): Promise<Record<string, string>> {
    return await this.userService.deleteUserByUsername(username);
  }

  @UseGuards(JwtAuthGuard, SelfActionGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ type: UpdateUserPasswordDTO })
  @ApiResponse(API_RESPONSES.PASSWORD_UPDATED)
  @ApiResponse(API_RESPONSES.USER_NOT_FOUND)
  @ApiResponse(API_RESPONSES.INVALID_CREDENTIALS)
  @HttpCode(200)
  @Post('/update-password')
  async updateUserPassword(
    @Body() userData: UpdateUserPasswordDTO,
  ): Promise<Record<string, string>> {
    return await this.userService.updateUserPassword(
      userData.username,
      userData.currentPassword,
      userData.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard, SelfActionGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user username' })
  @ApiBody({ type: UpdateUserUsernameDTO })
  @ApiResponse(API_RESPONSES.USERNAME_UPDATED)
  @ApiResponse(API_RESPONSES.USER_NOT_FOUND)
  @HttpCode(200)
  @Post('/update-username')
  async updateUserUsername(
    @Body() userData: UpdateUserUsernameDTO,
    @Request() req,
  ): Promise<Record<string, string>> {
    return await this.userService.updateUserUsername(userData.username, userData.newUsername, req);
  }

  @UseGuards(JwtAuthGuard, SelfActionGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user email' })
  @ApiResponse(API_RESPONSES.EMAIL_UPDATED)
  @ApiResponse(API_RESPONSES.USER_NOT_FOUND)
  @ApiResponse(API_RESPONSES.INVALID_CREDENTIALS)
  @ApiBody({ type: UpdateUserEmailDTO })
  @HttpCode(200)
  @Post('/update-email')
  async updateUserEmail(@Body() userData: UpdateUserEmailDTO): Promise<Record<string, string>> {
    return await this.userService.updateUserEmail(userData);
  }
}
