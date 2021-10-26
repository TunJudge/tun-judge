import { Module } from '@nestjs/common';

import { CustomRepositoryProvider } from '../../core/extended-repository';
import { Problem } from '../../entities';
import { ExecutablesModule } from '../executables/executables.module';
import { SubmissionsModule } from '../submissions/submissions.module';
import { TestcasesModule } from '../testcases/testcases.module';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';

@Module({
  controllers: [ProblemsController],
  imports: [ExecutablesModule, SubmissionsModule, TestcasesModule],
  providers: [ProblemsService, CustomRepositoryProvider(Problem)],
  exports: [ProblemsService],
})
export class ProblemsModule {}
