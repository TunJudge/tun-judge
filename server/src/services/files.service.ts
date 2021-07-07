import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { LogClass } from '../core/log.decorator';
import { File } from '../entities';

@LogClass
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: ExtendedRepository<File>,
  ) {}

  getById(id: number, relations: string[] = []): Promise<File> {
    return this.filesRepository.findOneOrThrow(
      { where: { id }, relations },
      new NotFoundException('File not found!'),
    );
  }
}
