import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../../core/extended-repository';
import { LogClass } from '../../core/log.decorator';
import { submissionInFreezeTime } from '../../core/utils';
import { Submission } from '../../entities';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@LogClass
@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: ExtendedRepository<Submission>,
    @Inject(forwardRef(() => ScoreboardService))
    private readonly scoreboardService: ScoreboardService,
    private readonly websocketGateway: WebsocketGateway
  ) {}

  search(
    page: number,
    size: number,
    contest?: number,
    problems?: number[],
    teams?: number[],
    languages?: number[],
    status?: 'notJudged' | 'notVerified'
  ): Promise<[Submission[], number]> {
    const notJudged = status === 'notJudged';
    const notVerified = status === 'notVerified';

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

    if (contest) {
      query = query.andWhere('contest.id = :contestId', { contestId: contest });
    }

    if (problems) {
      query = query.andWhere('problem.id IN (:...problemIds)', { problemIds: problems });
    }

    if (teams) {
      query = query.andWhere('team.id IN (:...teamIds)', { teamIds: teams });
    }

    if (languages) {
      query = query.andWhere('language.id IN (:...languageIds)', { languageIds: languages });
    }

    if (notJudged) {
      query = query.andWhere(
        '(SELECT COUNT(*) FROM "judging" WHERE "judging"."submissionId" = "submission"."id") = 0'
      );
    }

    if (notVerified) {
      query = query.andWhere(
        '(SELECT COUNT(*) FROM "judging" WHERE "judging"."submissionId" = "submission"."id" AND "judging"."verified" = FALSE) > 0'
      );
    }
    return query.getManyAndCount();
  }

  getById(id: number): Promise<Submission> {
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
          'judgings.runs.testcase.input',
          'judgings.runs.testcase.output',
          'judgings.runs.runOutput',
          'judgings.runs.checkerOutput',
          'judgings.runs.checkerOutput.content',
          'judgings.runs.errorOutput',
          'judgings.runs.errorOutput.content',
        ],
      },
      new NotFoundException('Submission not found!')
    );
  }

  save(submission: Submission): Promise<Submission> {
    return this.submissionsRepository.save(submission);
  }

  async getByContestIdAndProblemId(contestId: number, problemId: number): Promise<Submission[]> {
    return this.submissionsRepository.find({
      where: {
        contest: { id: contestId },
        problem: { id: problemId },
        valid: true,
      },
      relations: ['team', 'judgings'],
      order: { submitTime: 'ASC' },
    });
  }

  async getByContestIdAndTeamId(contestId: number, teamId: number): Promise<Submission[]> {
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
      const inFreezeTime = submissionInFreezeTime(submission.contest)(submission);
      if (submission.contest.verificationRequired || inFreezeTime) {
        const judging = submission.judgings
          .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
          .shift();
        submission.judgings = judging?.verified && !inFreezeTime ? [judging] : [];
      }
      return submission;
    });
  }

  async setValid(id: number, valid: boolean): Promise<void> {
    const { team, problem, contest } = await this.submissionsRepository.findOneOrThrow(
      {
        where: { id },
        relations: ['team', 'problem', 'contest'],
      },
      new NotFoundException()
    );
    await this.submissionsRepository.update({ id }, { valid });
    await this.scoreboardService.refreshScoreCache(contest, team, problem);
  }

  async rejudge(id: number): Promise<void> {
    await this.submissionsRepository.update({ id }, { judgeHost: null });
  }

  async rejudgeByProblemId(id: number): Promise<void> {
    await this.submissionsRepository.update({ problem: { id } }, { judgeHost: null });
  }

  getNextSubmission(): Promise<Submission> {
    return this.submissionsRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.contest', 'contest')
      .leftJoinAndSelect('s.file', 'file')
      .leftJoinAndSelect('file.content', 'fileContent')
      .leftJoinAndSelect('s.language', 'language')
      .leftJoinAndSelect('language.buildScript', 'languageBuildScript')
      .leftJoinAndSelect('languageBuildScript.content', 'languageBuildScriptContent')
      .leftJoinAndSelect('s.problem', 'problem')
      .leftJoinAndSelect('problem.testcases', 'testcases')
      .leftJoinAndSelect('testcases.input', 'input')
      .leftJoinAndSelect('testcases.output', 'output')
      .leftJoinAndSelect('problem.runScript', 'runScript')
      .leftJoinAndSelect('runScript.file', 'runScriptFile')
      .leftJoinAndSelect('runScriptFile.content', 'runScriptFileContent')
      .leftJoinAndSelect('runScript.buildScript', 'runScriptBuildScript')
      .leftJoinAndSelect('runScriptBuildScript.content', 'runScriptBuildScriptContent')
      .leftJoinAndSelect('problem.checkScript', 'checkScript')
      .leftJoinAndSelect('checkScript.file', 'checkScriptFile')
      .leftJoinAndSelect('checkScriptFile.content', 'checkScriptFileContent')
      .leftJoinAndSelect('checkScript.buildScript', 'checkScriptBuildScript')
      .leftJoinAndSelect('checkScriptBuildScript.content', 'checkScriptBuildScriptContent')
      .where('s.judgeHost is null')
      .andWhere('contest.enabled = true')
      .andWhere('language.allowJudge = true')
      .orderBy('s.submitTime', 'ASC')
      .getOne();
  }

  // @Interval(1000)
  async triggerForNewSubmissions() {
    if (await this.getNextSubmission()) {
      this.websocketGateway.pingForNewSubmissions();
    }
  }
}
