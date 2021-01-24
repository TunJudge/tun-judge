import { Injectable } from '@nestjs/common';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { Contest } from '../entities';
import { EntityTransformer } from './entity.transformer';

@Injectable()
export class ContestTransformer implements EntityTransformer<Contest> {
  entityName = 'Contest';

  async fromZip(zip: JSZip): Promise<Contest> {
    const subZip = zip.folder(this.entityName);
    return load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Contest;
  }

  async toZip(contest: Contest, zip: JSZip): Promise<void> {
    const subZip = zip.folder(this.entityName);
    const metadata = dump({
      name: contest.name,
      shortName: contest.shortName,
      activateTime: contest.activateTime,
      startTime: contest.startTime,
      freezeTime: contest.freezeTime,
      endTime: contest.endTime,
      unfreezeTime: contest.unfreezeTime,
      finalizeTime: contest.finalizeTime,
      finalizeComment: contest.finalizeComment,
      extraBronzeMedals: contest.extraBronzeMedals,
      enabled: contest.enabled,
      processBalloons: contest.processBalloons,
      public: contest.public,
      openToAllTeams: contest.openToAllTeams,
      verificationRequired: contest.verificationRequired,
    } as Partial<Contest>);
    subZip.file(`${this.entityName}.yaml`, metadata);
  }
}
