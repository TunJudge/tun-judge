import { Module } from '@nestjs/common';

import { FilesStorage } from '../files-storage';
import { FilesController, PublicFilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [PublicFilesController, FilesController],
  providers: [FilesService, FilesStorage],
  exports: [FilesService, FilesStorage],
})
export class FilesModule {}
