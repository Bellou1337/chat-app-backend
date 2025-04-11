export class UserDTO {
  readonly username: string;
  readonly password: string;
  readonly role: string;
  readonly status: string;
  readonly refreshToken?: string;
}
