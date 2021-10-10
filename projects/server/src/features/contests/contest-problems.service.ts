import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../../core/extended-repository';
import { LogClass } from '../../core/log.decorator';
import { ContestProblem } from '../../entities';

@LogClass
@Injectable()
export class ContestProblemsService {
  constructor(
    @InjectRepository(ContestProblem)
    private readonly contestProblemsRepository: ExtendedRepository<ContestProblem>
  ) {}

  getByContestId(id: number): Promise<ContestProblem[]> {
    return this.contestProblemsRepository.find({
      order: { shortName: 'ASC' },
      where: { contest: { id: id } },
      relations: ['problem', 'problem.file', 'problem.file.content'],
    });
  }

  save(problem: ContestProblem): Promise<ContestProblem> {
    return this.contestProblemsRepository.save(problem);
  }

  async deleteByContestId(id: number): Promise<void> {
    await this.contestProblemsRepository.delete({ contest: { id } });
  }
}
