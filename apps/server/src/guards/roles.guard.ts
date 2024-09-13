import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('public-route', context.getHandler());
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.session.passport.user as User;
    if (!roles.includes(user.roleName)) {
      throw new ForbiddenException('You are not authorized to do this action!');
    }
    return true;
  }
}
