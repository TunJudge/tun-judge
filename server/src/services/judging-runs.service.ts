import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { LogClass } from '../core/log.decorator';
import { JudgingRun } from '../entities';

@LogClass
@Injectable()
export class JudgingRunsService {
  constructor(
    @InjectRepository(JudgingRun)
    private readonly judgingRunsRepository: ExtendedRepository<JudgingRun>,
  ) {}

  getById(id: number, relations: string[] = []): Promise<JudgingRun> {
    return this.judgingRunsRepository.findOneOrThrow(
      { where: { id }, relations },
      new NotFoundException('Judging Run not found!'),
    );
  }

  save(judgingRun: JudgingRun): Promise<JudgingRun> {
    return this.judgingRunsRepository.save(judgingRun);
  }
}
