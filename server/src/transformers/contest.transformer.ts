import { Injectable } from '@nestjs/common';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { basename } from 'path';
import { Contest } from '../entities';
import { ContestProblemTransformer } from './contest-problem.transformer';
import { EntityTransformer } from './entity.transformer';
import { TeamTransformer } from './team.transformer';

@Injectable()
export class ContestTransformer implements EntityTransformer<Contest> {
  entityName = 'Contest';

  constructor(
    private readonly teamTransformer: TeamTransformer,
    private readonly contestProblemTransformer: ContestProblemTransformer,
  ) {}

  async fromZipToMany(zip: JSZip, basePath = ''): Promise<Contest[]> {
    return Promise.all(
      Object.keys(zip.files)
        .filter(
          (file) =>
            file.startsWith(basePath) &&
            new RegExp(`${basePath}[^\/]+\/Contest\/$`, 'gm').test(file),
        )
        .map((folder) => folder.replace(/Contest\/$/g, ''))
        .map((folder) => this.fromZip(zip.folder(basename(folder)), folder)),
    );
  }

  async fromZip(zip: JSZip, basePath = ''): Promise<Contest> {
    const subZip = zip.folder(this.entityName);
    const contest = load(await subZip.file(`${this.entityName}.yaml`).async('string')) as Contest;
    const problemsZip = subZip.folder('problems');
    contest.problems = await this.contestProblemTransformer.fromZipToMany(
      problemsZip,
      `${basePath}Contest/problems/`,
    );
    const teamsZip = subZip.folder('teams');
    contest.teams = await this.teamTransformer.fromZipToMany(teamsZip, `${basePath}Contest/teams/`);
    return contest;
  }

  async manyToZip(contests: Contest[], zip: JSZip): Promise<void> {
    for (const contest of contests) {
      if (!contest.shortName) continue;
      await this.toZip(contest, zip.folder(contest.shortName));
    }
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
    const problemsZip = subZip.folder('problems');
    await this.contestProblemTransformer.manyToZip(contest.problems, problemsZip);
    const teamsZip = subZip.folder('teams');
    await this.teamTransformer.manyToZip(contest.teams, teamsZip);
    subZip.file(`${this.entityName}.yaml`, metadata);
  }
}
