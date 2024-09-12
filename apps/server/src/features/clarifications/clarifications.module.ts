import { Module } from '@nestjs/common';

import { CustomRepositoryProvider } from '../../core/extended-repository';
import { Clarification, ClarificationMessage } from '../../entities';
import { ClarificationsService } from './clarifications.service';

@Module({
  providers: [
    ClarificationsService,
    CustomRepositoryProvider(Clarification),
    CustomRepositoryProvider(ClarificationMessage),
  ],
  exports: [ClarificationsService],
})
export class ClarificationsModule {}
