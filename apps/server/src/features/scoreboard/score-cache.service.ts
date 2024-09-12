import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtendedRepository } from '../../core/extended-repository';
import { LogClass } from '../../core/log.decorator';
import { ScoreCache } from '../../entities';

@LogClass
@Injectable()
export class ScoreCacheService {
  constructor(
    @InjectRepository(ScoreCache)
    private readonly scoreCachesRepository: ExtendedRepository<ScoreCache>
  ) {}

  find(scoreCache: Partial<ScoreCache>, relations: string[] = []): Promise<ScoreCache[]> {
    return this.scoreCachesRepository.find({
      where: scoreCache,
      relations,
    });
  }

  save(scoreCache: Partial<ScoreCache>): Promise<ScoreCache> {
    return this.scoreCachesRepository.save(scoreCache);
  }

  async delete(scoreCache: Partial<ScoreCache>): Promise<void> {
    await this.scoreCachesRepository.delete(scoreCache);
  }
}
