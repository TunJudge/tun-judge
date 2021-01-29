import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { Executable, ExecutableType } from '../entities';

@Injectable()
export class ExecutablesService {
  constructor(
    @InjectRepository(Executable)
    private readonly executablesRepository: ExtendedRepository<Executable>,
  ) {}

  getAll(): Promise<Executable[]> {
    return this.executablesRepository.find({
      relations: ['file', 'file.content', 'buildScript', 'buildScript.content'],
      order: { id: 'ASC' },
    });
  }

  getAllWithRelations(relations: string[]): Promise<Executable[]> {
    return this.executablesRepository.find({ relations });
  }

  getById(id: number, relations: string[] = []): Promise<Executable> {
    return this.executablesRepository.findOneOrThrow(
      { where: { id }, relations },
      new NotFoundException('Executable not found!'),
    );
  }

  getDefaultByType(type: ExecutableType): Promise<Executable> {
    return this.executablesRepository.findOneOrThrow(
      { type },
      new NotFoundException('Executable not found!'),
    );
  }

  async save(executable: Executable): Promise<Executable> {
    if (executable.default) {
      await this.executablesRepository.update(
        { type: executable.type, default: true },
        { default: false },
      );
    }
    return this.executablesRepository.save(executable);
  }

  async update(id: number, executable: Executable): Promise<Executable> {
    const oldExecutable = await this.executablesRepository.findOneOrThrow(
      id,
      new NotFoundException('Executable not found!'),
    );
    return this.save({ ...oldExecutable, ...executable });
  }

  async delete(id: number): Promise<void> {
    await this.executablesRepository.delete(id);
  }
}
