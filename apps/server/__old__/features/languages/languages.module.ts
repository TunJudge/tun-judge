import { Module } from '@nestjs/common';

import { CustomRepositoryProvider } from '../../core/extended-repository';
import { Language } from '../../entities';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';

@Module({
  controllers: [LanguagesController],
  providers: [LanguagesService, CustomRepositoryProvider(Language)],
  exports: [LanguagesService],
})
export class LanguagesModule {}
