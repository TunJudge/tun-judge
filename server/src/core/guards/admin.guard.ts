import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return (
      context.switchToHttp().getRequest().session.passport.user.role.name ===
      'admin'
    );
  }
}
