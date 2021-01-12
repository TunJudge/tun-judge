import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JudgeHostGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return ['admin', 'judge-host'].includes(
      context.switchToHttp().getRequest().session.passport.user.role.name,
    );
  }
}
