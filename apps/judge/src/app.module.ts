import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { SubmissionHelper } from './helpers';
import { Compiler, Executor, Initializer } from './judging-steps';
import { DockerService, JudgingService, SocketService, SystemService } from './services';

const JUDGING_STEPS = [Initializer, Compiler, Executor];

const SERVICES = [DockerService, JudgingService, SocketService, SystemService];

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SubmissionHelper, ...JUDGING_STEPS, ...SERVICES],
})
export class AppModule {}
