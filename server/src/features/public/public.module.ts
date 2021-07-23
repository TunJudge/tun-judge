import { Module } from '@nestjs/common';
import { ContestsModule } from '../contests/contests.module';
import { ScoreboardModule } from '../scoreboard/scoreboard.module';
import { UsersModule } from '../users/users.module';
import { PublicController } from './public.controller';

@Module({
  controllers: [PublicController],
  imports: [UsersModule, ContestsModule, ScoreboardModule],
})
export class PublicModule {}
