import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Submission } from '../entities';
import { ExtendedRepository } from '../core/extended-repository';
import { ScoreboardService } from './scoreboard.service';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: ExtendedRepository<Submission>,
    private readonly scoreboardService: ScoreboardService,
  ) {}

  search(
    page: number,
    size: number,
    problems: string,
    teams: string,
    languages: string,
    _notJudged: string,
    _notVerified: string,
  ): Promise<[Submission[], number]> {
    page ??= 0;
    size ??= 10;
    const notJudged = Boolean(_notJudged === 'true');
    const notVerified = Boolean(_notVerified === 'true');
    let query = this.submissionsRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.team', 'team')
      .leftJoinAndSelect('submission.problem', 'problem')
      .leftJoinAndSelect('submission.language', 'language')
      .leftJoinAndSelect('problem.testcases', 'testcases')
      .leftJoinAndSelect('submission.contest', 'contest')
      .leftJoinAndSelect('submission.judgings', 'judgings')
      .leftJoinAndSelect('judgings.juryMember', 'juryMember')
      .leftJoinAndSelect('judgings.runs', 'runs')
      .leftJoinAndSelect('runs.testcase', 'testcase')
      .orderBy('submission.submitTime', 'DESC')
      .take(size)
      .skip(size * page);
    if (problems) {
      query = query.andWhere('problem.id IN (:...problemIds)', {
        problemIds: problems.split(',').map((i) => parseInt(i)),
      });
    }
    if (teams) {
      query = query.andWhere('team.id IN (:...teamIds)', {
        teamIds: teams.split(',').map((i) => parseInt(i)),
      });
    }
    if (languages) {
      query = query.andWhere('language.id IN (:...languageIds)', {
        languageIds: languages.split(',').map((i) => parseInt(i)),
      });
    }
    if (notJudged) {
      query = query.andWhere(
        '(SELECT COUNT(*) FROM judging WHERE "judging"."submissionId" = "submission"."id") = 0',
      );
    }
    if (notVerified) {
      query = query.andWhere(
        '(SELECT COUNT(*) FROM judging WHERE "judging"."submissionId" = "submission"."id" AND "judging"."verified" = FALSE) > 0',
      );
    }
    return query.getManyAndCount();
  }

  getOneById(id: number): Promise<Submission> {
    return this.submissionsRepository.findOneOrThrow(
      {
        where: { id },
        order: { submitTime: 'DESC' },
        relations: [
          'team',
          'file',
          'file.content',
          'problem',
          'problem.testcases',
          'language',
          'contest',
          'judgings',
          'judgings.juryMember',
          'judgings.runs',
          'judgings.runs.testcase',
          'judgings.runs.runOutput',
          'judgings.runs.checkerOutput',
          'judgings.runs.checkerOutput.content',
          'judgings.runs.errorOutput',
          'judgings.runs.errorOutput.content',
        ],
      },
      new NotFoundException(),
    );
  }

  async getByContestIdAndTeamId(
    contestId: number,
    teamId: number,
  ): Promise<Submission[]> {
    return (
      await this.submissionsRepository.find({
        where: {
          contest: { id: contestId },
          team: { id: teamId },
          valid: true,
        },
        relations: ['language', 'contest', 'problem', 'judgings'],
        order: { submitTime: 'DESC' },
      })
    ).map((submission) => {
      if (submission.contest.verificationRequired) {
        const judging = submission.judgings
          .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
          .shift();
        submission.judgings = judging?.verified ? [judging] : [];
      }
      return submission;
    });
  }

  async setValid(id: number, valid: boolean): Promise<void> {
    const {
      team,
      problem,
      contest,
    } = await this.submissionsRepository.findOneOrThrow(
      {
        where: { id },
        relations: ['team', 'problem', 'contest'],
      },
      new NotFoundException(),
    );
    await this.submissionsRepository.update({ id }, { valid });
    await this.scoreboardService.refreshScoreCache(contest, team, problem);
  }

  async rejudge(id: number): Promise<void> {
    await this.submissionsRepository.update({ id }, { judgeHost: null });
  }
}
