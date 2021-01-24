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

  async fromZip(zip: JSZip, basePath = ''): Promise<Contest> {
    const subZip = zip.folder(this.entityName);
    const contest = load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Contest;
    const problemsZip = subZip.folder('problems');
    contest.problems = await Promise.all(
      Object.keys(problemsZip.files)
        .filter(
          (file) =>
            file.startsWith(basePath) &&
            /Contest\/problems\/[^\/]+\/$/g.test(file),
        )
        .map((folder) =>
          this.contestProblemTransformer.fromZip(
            problemsZip.folder(basename(folder)),
            folder,
          ),
        ),
    );
    const teamsZip = subZip.folder('teams');
    contest.teams = await Promise.all(
      Object.keys(teamsZip.files)
        .filter(
          (file) =>
            file.startsWith(basePath) &&
            /Contest\/teams\/[^\/]+\/$/g.test(file),
        )
        .map((folder) =>
          this.teamTransformer.fromZip(
            teamsZip.folder(basename(folder)),
            folder,
          ),
        ),
    );
    return contest;
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
    for (const problem of contest.problems) {
      const problemZip = problemsZip.folder(problem.shortName);
      await this.contestProblemTransformer.toZip(problem, problemZip);
    }
    const teamsZip = subZip.folder('teams');
    for (const team of contest.teams) {
      const teamZip = teamsZip.folder(team.name);
      await this.teamTransformer.toZip(team, teamZip);
    }
    subZip.file(`${this.entityName}.yaml`, metadata);
  }
}
