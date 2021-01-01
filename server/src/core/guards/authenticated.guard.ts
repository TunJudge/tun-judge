import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { ExtendedRepository } from '../extended-repository';
import { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.isAuthenticated()) {
      return this.checkBasicAuthentication(request);
    }
    return true;
  }

  async checkBasicAuthentication(request: Request): Promise<boolean> {
    const authHeader = request.headers.authorization?.split(' ')?.pop();
    if (!authHeader) throw new UnauthorizedException();
    const [username, password] = Buffer.from(authHeader, 'base64')
      .toString()
      .split(':');
    const user = await this.usersRepository.findOneOrThrow(
      { username },
      new UnauthorizedException(),
    );
    if (!user.checkPassword(password)) throw new UnauthorizedException();
    return true;
  }
}
