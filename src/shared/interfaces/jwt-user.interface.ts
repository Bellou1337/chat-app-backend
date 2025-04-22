import { UserRole } from '../enums';

export interface JwtUser {
  sub: UserRole;
  username: string;
}
