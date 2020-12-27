import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userId = context.switchToHttp().getRequest().session.passport.user.id;
    return (
      (await this.userRoleRepository.count({
        user: { id: userId },
        role: { name: 'admin' },
      })) > 0
    );
  }
}
