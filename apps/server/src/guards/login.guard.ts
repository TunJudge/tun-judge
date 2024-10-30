import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('LoginGuard', context.switchToHttp().getRequest().body);

    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    return result;
  }
}
