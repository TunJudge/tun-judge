import { Injectable } from '@nestjs/common';
import { Contest, Problem, Team } from '../../entities';
import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class ContestsInitializer extends AbstractInitializer {
  async run(entityManager): Promise<void> {
    const contests = await this.parseMetadataFile('contests.json');
    for (const contest of contests) {
      contest.teams = await Promise.all(
        contest.teams.map((team) => entityManager.findOne(Team, team))
      );
      for (const contestProblem of contest.problems) {
        contestProblem.problem = await entityManager.findOne(Problem, contestProblem.problem);
      }
    }
    return entityManager.save(Contest, contests);
  }
}
