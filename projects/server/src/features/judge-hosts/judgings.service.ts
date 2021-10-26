import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtendedRepository } from '../../core/extended-repository';
import { LogClass } from '../../core/log.decorator';
import { Judging } from '../../entities';
import { ScoreboardService } from '../scoreboard/scoreboard.service';

@LogClass
@Injectable()
export class JudgingsService {
  constructor(
    @InjectRepository(Judging)
    private readonly judgingsRepository: ExtendedRepository<Judging>,
    private readonly scoreboardService: ScoreboardService
  ) {}

  getById(id: number, relations: string[] = []): Promise<Judging> {
    return this.judgingsRepository.findOneOrThrow(
      { where: { id }, relations },
      new NotFoundException('Judging not found!')
    );
  }

  getUnfinishedBySubmissionId(submissionId: number): Promise<Judging> {
    return this.judgingsRepository.findOne({
      endTime: null,
      submission: { id: submissionId },
    });
  }

  save(judging: Judging): Promise<Judging> {
    return this.judgingsRepository.save(judging);
  }

  async setVerified(id: number, userId: number): Promise<Judging> {
    const judging = await this.judgingsRepository.findOneOrThrow(
      {
        where: { submission: { id }, valid: true },
        relations: ['contest', 'submission', 'submission.team', 'submission.problem'],
        order: { startTime: 'DESC' },
      },
      new NotFoundException()
    );
    const {
      id: judgingId,
      contest,
      submission: { team, problem },
    } = judging;
    await this.judgingsRepository.update(judgingId, {
      juryMember: { id: userId },
      verified: true,
    });
    await this.scoreboardService.refreshScoreCache(contest, team, problem);
    return judging;
  }

  async setJuryMember(id: number, userId: number, value = { id: userId }): Promise<void> {
    const judging = await this.judgingsRepository.findOneOrThrow(
      {
        where: { submission: { id } },
        order: { startTime: 'DESC' },
      },
      new NotFoundException('Judging not found!')
    );
    await this.judgingsRepository.update(judging.id, {
      juryMember: value,
    });
  }
}
