import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordDTO {
  @ApiProperty({ example: 'current_password' })
  @IsNotEmpty({ message: 'Current password cannot be empty' })
  @IsString({ message: 'Current password must be a string' })
  currentPassword: string;

  @ApiProperty({ example: 'new_password' })
  @IsNotEmpty({ message: 'New password cannot be empty' })
  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;

  @ApiProperty({ example: 'username' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  username: string;
}
