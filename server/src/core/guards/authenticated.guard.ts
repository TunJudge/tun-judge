import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!context.switchToHttp().getRequest().isAuthenticated()) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
