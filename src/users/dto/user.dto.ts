import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ example: 'username123' })
  readonly username: string;

  readonly password: string;

  @ApiProperty({ example: 'email' })
  readonly email: string;

  @ApiProperty({ example: 'user' })
  readonly role: string;

  @ApiProperty({ example: 'offline' })
  readonly status: string;

  @ApiProperty({ example: '12345' })
  readonly refreshToken?: string;
}
