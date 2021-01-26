import { Injectable } from '@nestjs/common';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { basename } from 'path';
import { Team } from '../entities';
import { EntityTransformer } from './entity.transformer';

@Injectable()
export class TeamTransformer implements EntityTransformer<Team> {
  entityName = 'Team';

  async fromZipToMany(zip: JSZip, basePath = ''): Promise<Team[]> {
    return Promise.all(
      Object.keys(zip.files)
        .filter(
          (file) =>
            file.startsWith(basePath) &&
            new RegExp(`${basePath}[^\/]+\/Team\/$`, 'gm').test(file),
        )
        .map((folder) => folder.replace(/Team\/$/g, ''))
        .map((folder) => this.fromZip(zip.folder(basename(folder)))),
    );
  }

  async fromZip(zip: JSZip): Promise<Team> {
    const subZip = zip.folder(this.entityName);
    return load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Team;
  }

  async manyToZip(teams: Team[], zip: JSZip): Promise<void> {
    for (const team of teams) {
      if (!team.name) continue;
      await this.toZip(team, zip.folder(team.name));
    }
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
