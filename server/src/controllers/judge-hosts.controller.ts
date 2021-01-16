import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthenticatedGuard } from '../core/guards';
import { InjectRepository } from '@nestjs/typeorm';
import { JudgeHost, Judging, JudgingRun, Submission, User } from '../entities';
import { ExtendedRepository } from '../core/extended-repository';
import { JudgeHostGuard } from '../core/guards/judge-host.guard';

@Controller('judge-hosts')
@UseGuards(AuthenticatedGuard)
export class JudgeHostsController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
    @InjectRepository(Judging)
    private readonly judgingsRepository: ExtendedRepository<Judging>,
    @InjectRepository(JudgingRun)
    private readonly judgingRunsRepository: ExtendedRepository<JudgingRun>,
    @InjectRepository(JudgeHost)
    private readonly judgeHostsRepository: ExtendedRepository<JudgeHost>,
    @InjectRepository(Submission)
    private readonly submissionsRepository: ExtendedRepository<Submission>,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  getAll(): Promise<JudgeHost[]> {
    return this.judgeHostsRepository.find({
      order: { id: 'ASC' },
      relations: ['user'],
    });
  }

  @Patch(':id/toggle/:active')
  @UseGuards(AdminGuard)
  async toggle(
    @Param('id') id: number,
    @Param('active') active: string,
  ): Promise<void> {
    await this.judgeHostsRepository.findOneOrThrow(
      { id: id },
      new NotFoundException(),
    );
    await this.judgeHostsRepository.update(
      { id },
      { active: active === 'true' },
    );
  }

  @Post('subscribe')
  @UseGuards(JudgeHostGuard)
  async subscribe(@Body() { hostname, username }: any): Promise<void> {
    const user = await this.usersRepository.findOneOrThrow(
      { username },
      new NotFoundException(`User with username ${username} not found!`),
    );
    if (await this.judgeHostsRepository.count({ hostname })) {
      await this.judgeHostsRepository.update(
        { hostname },
        { user, pollTime: new Date() },
      );
    } else {
      await this.judgeHostsRepository.save({
        hostname: hostname,
        user: user,
        active: true,
        pollTime: new Date(),
      });
    }
  }

  @Put(':hostname/update-judging/:id')
  @UseGuards(JudgeHostGuard)
  async updateJudging(
    @Param('hostname') hostname: string,
    @Param('id') judgingId: number,
    @Body() judging: Judging,
  ): Promise<void> {
    const oldJudging = await this.judgingsRepository.findOneOrThrow(
      { id: judgingId },
      new NotFoundException(`No judging found for id ${judgingId}`),
    );
    await this.judgingsRepository.save({ ...oldJudging, ...judging });
  }

  @Post(':hostname/add-judging-run/:id')
  @UseGuards(JudgeHostGuard)
  async addJudgingRun(
    @Param('hostname') hostname: string,
    @Param('id') judgingId: number,
    @Body() judgingRun: JudgingRun,
  ): Promise<void> {
    await this.judgingsRepository.findOneOrThrow(
      { id: judgingId },
      new NotFoundException(`No judging found for id ${judgingId}`),
    );
    await this.judgingRunsRepository.save(judgingRun);
  }

  @Get(':hostname/next-judging')
  @UseGuards(JudgeHostGuard)
  async getNextJudging(
    @Param('hostname') hostname: string,
  ): Promise<Judging | undefined> {
    const judgeHost = await this.judgeHostsRepository.findOneOrThrow(
      { hostname },
      new NotFoundException(),
    );
    await this.judgeHostsRepository.update(
      { hostname },
      { pollTime: new Date() },
    );
    if (!judgeHost.active) return undefined;
    const submission = await this.submissionsRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.contest', 'contest')
      .leftJoinAndSelect('s.file', 'file')
      .leftJoinAndSelect('file.content', 'fileContent')
      .leftJoinAndSelect('s.language', 'language')
      .leftJoinAndSelect('language.buildScript', 'languageBuildScript')
      .leftJoinAndSelect(
        'languageBuildScript.content',
        'languageBuildScriptContent',
      )
      .leftJoinAndSelect('s.problem', 'problem')
      .leftJoinAndSelect('problem.testcases', 'testcases')
      .leftJoinAndSelect('testcases.input', 'input')
      .leftJoinAndSelect('testcases.output', 'output')
      .leftJoinAndSelect('problem.runScript', 'runScript')
      .leftJoinAndSelect('runScript.file', 'runScriptFile')
      .leftJoinAndSelect('runScriptFile.content', 'runScriptFileContent')
      .leftJoinAndSelect('runScript.buildScript', 'runScriptBuildScript')
      .leftJoinAndSelect(
        'runScriptBuildScript.content',
        'runScriptBuildScriptContent',
      )
      .leftJoinAndSelect('problem.checkScript', 'checkScript')
      .leftJoinAndSelect('checkScript.file', 'checkScriptFile')
      .leftJoinAndSelect('checkScriptFile.content', 'checkScriptFileContent')
      .leftJoinAndSelect('checkScript.buildScript', 'checkScriptBuildScript')
      .leftJoinAndSelect(
        'checkScriptBuildScript.content',
        'checkScriptBuildScriptContent',
      )
      .where('s.judgeHost is null')
      .andWhere('contest.enabled = true')
      .andWhere('language.allowJudge = true')
      .orderBy('s.submitTime', 'ASC')
      .getOne();
    if (submission) {
      const judging = await this.judgingsRepository.save({
        startTime: new Date(),
        contest: { id: submission.contest.id },
        judgeHost: { id: judgeHost.id },
        submission: { id: submission.id },
      });
      submission.judgeHost = judgeHost;
      await this.submissionsRepository.save(submission);
      judging.submission = submission;
      return judging;
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number): Promise<void> {
    await this.judgeHostsRepository.delete(id);
  }
}
