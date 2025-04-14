import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserUsernameDTO {
  @ApiProperty({ example: 'current_username' })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username must not be empty' })
  username: string;

  @ApiProperty({ example: 'new_username' })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username must not be empty' })
  newUsername: string;
}
