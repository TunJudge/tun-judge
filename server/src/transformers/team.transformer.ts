import { Injectable } from '@nestjs/common';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { Team } from '../entities';
import { EntityTransformer } from './entity.transformer';

@Injectable()
export class TeamTransformer implements EntityTransformer<Team> {
  entityName = 'Team';

  async fromZip(zip: JSZip, baseUrl = ''): Promise<Team> {
    const subZip = zip.folder(this.entityName);
    return load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Team;
  }

  async toZip(team: Team, zip: JSZip): Promise<void> {
    const subZip = zip.folder(this.entityName);
    delete team.user.password;
    delete team.user.clean;
    delete team.user.checkPassword;
    const metadata = dump({
      name: team.name,
      enabled: team.enabled,
      members: team.members,
      room: team.room,
      comments: team.comments,
      penalty: team.penalty,
      user: team.user,
      category: team.category,
    } as Partial<Team>);
    subZip.file(`${this.entityName}.yaml`, metadata);
  }
}
