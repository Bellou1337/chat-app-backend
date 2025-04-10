import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty({ example: 'username' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Cannot be empty' })
  readonly username: string;

  @ApiProperty({ example: 'password' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Cannot be empty' })
  @MinLength(6, { message: 'Must be at least 6 characters' })
  readonly password: string;
}
