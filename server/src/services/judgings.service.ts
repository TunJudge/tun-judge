import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { Judging } from '../entities';
import { ScoreboardService } from './scoreboard.service';

@Injectable()
export class JudgingsService {
  constructor(
    @InjectRepository(Judging)
    private readonly judgingsRepository: ExtendedRepository<Judging>,
    private readonly scoreboardService: ScoreboardService,
  ) {}

  async setVerified(id: number, userId: number): Promise<void> {
    const {
      id: judgingId,
      contest,
      submission: { team, problem },
    } = await this.judgingsRepository.findOneOrThrow(
      {
        where: { submission: { id } },
        relations: [
          'contest',
          'submission',
          'submission.team',
          'submission.problem',
        ],
        order: { startTime: 'DESC' },
      },
      new NotFoundException(),
    );
    await this.judgingsRepository.update(judgingId, {
      juryMember: { id: userId },
      verified: true,
    });
    await this.scoreboardService.refreshScoreCache(contest, team, problem);
  }

  async setJuryMember(
    id: number,
    userId: number,
    value = { id: userId },
  ): Promise<void> {
    const judging = await this.judgingsRepository.findOneOrThrow(
      {
        where: { submission: { id }, juryMember: null },
        order: { startTime: 'DESC' },
      },
      new NotFoundException(),
    );
    await this.judgingsRepository.update(judging.id, {
      juryMember: value,
    });
  }
}
