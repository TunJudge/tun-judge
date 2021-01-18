import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JuryGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return ['admin', 'jury'].includes(
      context.switchToHttp().getRequest().session.passport.user.role.name,
    );
  }
}
