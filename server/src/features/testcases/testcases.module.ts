import { Module } from '@nestjs/common';
import { CustomRepositoryProvider } from '../../core/extended-repository';
import { Testcase } from '../../entities';
import { FilesModule } from '../files/files.module';
import { TestcasesController } from './testcases.controller';
import { TestcasesService } from './testcases.service';

@Module({
  controllers: [TestcasesController],
  imports: [FilesModule],
  providers: [TestcasesService, CustomRepositoryProvider(Testcase)],
  exports: [TestcasesService],
})
export class TestcasesModule {}
