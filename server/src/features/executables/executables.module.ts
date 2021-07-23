import { Module } from '@nestjs/common';
import { CustomRepositoryProvider } from '../../core/extended-repository';
import { Executable } from '../../entities';
import { ExecutablesController } from './executables.controller';
import { ExecutablesService } from './executables.service';

@Module({
  controllers: [ExecutablesController],
  providers: [ExecutablesService, CustomRepositoryProvider(Executable)],
  exports: [ExecutablesService],
})
export class ExecutablesModule {}
