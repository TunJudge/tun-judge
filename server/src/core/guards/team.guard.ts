import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TeamGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return ['admin', 'team'].includes(
      context.switchToHttp().getRequest().session.passport.user.role.name,
    );
  }
}
