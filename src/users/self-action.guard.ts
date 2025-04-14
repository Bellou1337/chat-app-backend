import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SelfActionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let username = request.query.username;

    if (!username) {
      username = request.body.username;
    }
    if (user.username !== username) {
      throw new ForbiddenException('You can only modify your own account');
    }

    return true;
  }
}
