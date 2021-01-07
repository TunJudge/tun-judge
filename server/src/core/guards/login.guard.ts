import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { ExtendedRepository } from '../extended-repository';
import store from '../session-store';

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.sessionId'])
      .where({ id: request.session.passport.user.id })
      .getOne();
    if (user) store.destroy(user.sessionId);
    await this.usersRepository.update(
      { id: request.session.passport.user.id },
      {
        lastLogin: new Date(),
        lastIpAddress:
          request.headers['x-forwarded-for'] || request.socket.remoteAddress,
        sessionId: request.sessionID,
      },
    );
    return result;
  }
}
