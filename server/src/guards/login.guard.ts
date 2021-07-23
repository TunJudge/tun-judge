import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { store } from '../core/session';
import { UsersService } from '../features/users/users.service';

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    const user = await this.usersService.getById(
      request.session.passport.user.id,
      [],
      ['id', 'sessionId'],
    );
    if (user) store.destroy(user.sessionId);
    await this.usersService.update(request.session.passport.user.id, {
      lastLogin: new Date(),
      lastIpAddress: request.headers['x-forwarded-for'] || request.socket.remoteAddress,
      sessionId: request.sessionID,
    });
    return result;
  }
}
