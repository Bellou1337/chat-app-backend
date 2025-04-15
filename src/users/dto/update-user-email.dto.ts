import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserEmailDTO {
  @ApiProperty({ example: 'current email' })
  @IsNotEmpty({ message: 'Current email cannot be empty' })
  @IsString({ message: 'Current email must be a string' })
  currentEmail: string;

  @ApiProperty({ example: 'new email' })
  @IsNotEmpty({ message: 'New email cannot be empty' })
  @IsString({ message: 'New email must be a string' })
  newEmail: string;

  @ApiProperty({ example: 'username' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  username: string;
}
