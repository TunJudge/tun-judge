import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtendedRepository } from '../../core/extended-repository';
import { LogClass } from '../../core/log.decorator';
import { JudgeHost } from '../../entities';

@LogClass
@Injectable()
export class JudgeHostsService {
  constructor(
    @InjectRepository(JudgeHost)
    private readonly judgeHostsRepository: ExtendedRepository<JudgeHost>
  ) {}

  getAll(): Promise<JudgeHost[]> {
    return this.judgeHostsRepository.find({
      relations: ['user'],
      order: { id: 'ASC' },
    });
  }

  getAllWithRelations(relations: string[]): Promise<JudgeHost[]> {
    return this.judgeHostsRepository.find({ relations });
  }

  async save(judgeHost: Partial<JudgeHost>): Promise<JudgeHost> {
    return this.judgeHostsRepository.save(judgeHost);
  }

  async update(criteria: Partial<JudgeHost>, executable: Partial<JudgeHost>): Promise<JudgeHost> {
    const oldJudgeHost = await this.judgeHostsRepository.findOneOrThrow(
      criteria,
      new NotFoundException('JudgeHost not found!')
    );
    return this.save({ ...oldJudgeHost, ...executable });
  }

  async delete(id: number): Promise<void> {
    await this.judgeHostsRepository.delete(id);
  }

  count(conditions: Partial<JudgeHost>): Promise<number> {
    return this.judgeHostsRepository.count(conditions);
  }

  async toggle(id: number, active: boolean): Promise<void> {
    await this.update({ id }, { active });
  }
}
