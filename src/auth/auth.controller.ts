import { Controller, Post, Body, HttpCode, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDTO, LoginUserDTO } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';
import { API_RESPONSES } from 'src/shared/swagger/api-responses';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { RefreshTokenDTO } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDTO })
  @HttpCode(200)
  @ApiResponse(API_RESPONSES.USERS_TOKEN)
  @ApiResponse(API_RESPONSES.INVALID_CREDENTIALS)
  async authorization(@Body() loginUserDTO: LoginUserDTO): Promise<Record<string, any>> {
    return await this.authService.signIn(loginUserDTO);
  }

  @Post('/register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: CreateUserDTO })
  @HttpCode(200)
  @ApiResponse(API_RESPONSES.USER_CREATED)
  @ApiResponse(API_RESPONSES.USER_CONFLICT)
  async registration(@Body() createUserDTO: CreateUserDTO): Promise<Record<string, string>> {
    return await this.usersService.createUser(createUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @ApiOperation({ summary: 'User logout' })
  @HttpCode(200)
  @ApiResponse(API_RESPONSES.LOGOUT_SUCCESS)
  @ApiResponse(API_RESPONSES.TOKEN_BLACKLISTED)
  @ApiBearerAuth('access-token')
  async logout(@Request() req): Promise<Record<string, string>> {
    return await this.authService.logout(req);
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDTO })
  @HttpCode(200)
  @ApiResponse(API_RESPONSES.TOKEN_REFRESHED)
  @ApiResponse(API_RESPONSES.INVALID_REFRESH_TOKEN)
  async refresh(@Body() body: { refresh_token: string }): Promise<Record<string, string>> {
    return await this.authService.refreshAccessToken(body.refresh_token);
  }
}
