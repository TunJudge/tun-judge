import { Module } from '@nestjs/common';

import { CustomRepositoryProvider } from '../../core/extended-repository';
import { File } from '../../entities';
import { FilesService } from './files.service';

@Module({
  providers: [FilesService, CustomRepositoryProvider(File)],
  exports: [FilesService],
})
export class FilesModule {}
