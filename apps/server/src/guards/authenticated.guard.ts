import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('public-route', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (!isPublic && !request.isAuthenticated()) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
