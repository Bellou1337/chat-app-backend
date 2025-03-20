import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { API_RESPONSES } from 'src/shared/swagger/api-responses';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  async authorization(): Promise<string> {
    return 'authorization';
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

  @Post('/logout')
  async logout(): Promise<string> {
    return 'logout';
  }
}
