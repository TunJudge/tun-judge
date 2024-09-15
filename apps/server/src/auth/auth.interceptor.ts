import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { LogClass } from '../logger';

@LogClass
@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (session?.passport?.user) {
      this.cls.set('auth', session.passport.user);
    }

    return next.handle();
  }
}
