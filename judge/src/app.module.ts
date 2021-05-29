import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SubmissionHelper } from './helpers';
import { Compiler, Executor, Initializer } from './judging-steps';
import { DockerService, JudgingService, SocketService } from './services';

const JUDGING_STEPS = [Initializer, Compiler, Executor];

const SERVICES = [SocketService, DockerService, JudgingService];

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SubmissionHelper, ...JUDGING_STEPS, ...SERVICES],
})
export class AppModule {}
