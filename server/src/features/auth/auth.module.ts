import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  controllers: [AuthController],
  imports: [PassportModule, UsersModule],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
