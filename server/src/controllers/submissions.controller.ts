import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthenticatedGuard, TeamGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { Submission } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('submissions')
@UseGuards(AuthenticatedGuard)
export class SubmissionsController {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: ExtendedRepository<Submission>,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  getAll(): Promise<Submission[]> {
    return this.submissionsRepository.find({
      order: { submitTime: 'DESC' },
      relations: ['user', 'category', 'contests'],
    });
  }

  @Post()
  @UseGuards(AdminGuard, TeamGuard)
  async create(@Body() submission: Submission): Promise<Submission> {
    return this.submissionsRepository.save(submission);
  }
}
