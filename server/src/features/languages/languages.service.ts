import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../../core/extended-repository';
import { LogClass } from '../../core/log.decorator';
import { Language } from '../../entities';

@LogClass
@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languagesRepository: ExtendedRepository<Language>,
  ) {}

  getAll(relations?: string[]): Promise<Language[]> {
    return this.languagesRepository.find({
      relations: relations,
      order: { id: 'ASC' },
    });
  }

  getById(id: number, relations: string[] = []): Promise<Language> {
    return this.languagesRepository.findOneOrThrow(
      { where: { id }, relations },
      new NotFoundException('Language not found!'),
    );
  }

  save(language: Language): Promise<Language> {
    return this.languagesRepository.save(language);
  }

  async update(id: number, language: Language): Promise<Language> {
    const oldLanguage = await this.languagesRepository.findOneOrThrow(
      id,
      new NotFoundException('Language not found!'),
    );
    return this.save({ ...oldLanguage, ...language });
  }

  async delete(id: number): Promise<void> {
    await this.languagesRepository.delete(id);
  }
}
