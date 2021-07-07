import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan } from 'typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { LogClass } from '../core/log.decorator';
import { FileContent, Testcase } from '../entities';
import { FilesService } from './files.service';

@LogClass
@Injectable()
export class TestcasesService {
  constructor(
    @InjectRepository(Testcase)
    private readonly testcasesRepository: ExtendedRepository<Testcase>,
    private readonly filesService: FilesService,
  ) {}

  getById(id: number, relations: string[] = []): Promise<Testcase> {
    return this.testcasesRepository.findOneOrThrow(
      { where: { id }, relations },
      new NotFoundException('Testcase not found!'),
    );
  }

  getByProblemId(id: number): Promise<Testcase[]> {
    return this.testcasesRepository.find({
      where: { problem: { id } },
      relations: ['input', 'output'],
      order: { rank: 'ASC' },
    });
  }

  async create(id: number, testcase: Testcase): Promise<Testcase> {
    return this.testcasesRepository.save({
      ...testcase,
      problem: { id },
      rank: await this.testcasesRepository.count({ problem: { id } }),
    });
  }

  async update(id: number, testcase: Testcase): Promise<Testcase> {
    const oldTestcase = await this.getById(id);
    return this.testcasesRepository.save({ ...oldTestcase, ...testcase });
  }

  async move(id: number, direction: 'up' | 'down'): Promise<void> {
    const testcase = await this.getById(id, ['problem']);
    const otherTestcase = await this.testcasesRepository.findOne({
      problem: { id: testcase.problem.id },
      rank: direction === 'up' ? testcase.rank - 1 : testcase.rank + 1,
    });
    if (otherTestcase) {
      const aux = otherTestcase.rank;
      otherTestcase.rank = testcase.rank;
      await this.testcasesRepository.save({ ...testcase, rank: -1 });
      await this.testcasesRepository.save(otherTestcase);
      await this.testcasesRepository.save({ ...testcase, rank: aux });
    }
  }

  async getContent(id: number, file: 'input' | 'output'): Promise<FileContent> {
    const testcase = await this.getById(id, [file]);
    return (await this.filesService.getById(testcase[file].id, ['content'])).content;
  }

  async delete(@Param('id') id: number): Promise<void> {
    const testcase = await this.getById(id, ['problem']);
    await this.testcasesRepository.delete(id);
    const testcases = await this.testcasesRepository.find({
      where: {
        problem: { id: testcase.problem.id },
        rank: MoreThan(testcase.rank),
      },
    });
    for (const _testcase of testcases) {
      await this.testcasesRepository.save({
        ..._testcase,
        rank: _testcase.rank - 1,
      });
    }
  }
}
