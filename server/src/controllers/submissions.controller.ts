import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthenticatedGuard } from '../core/guards';
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
      relations: [
        'team',
        'problem',
        'problem.testcases',
        'language',
        'contest',
        'judgings',
        'judgings.juryMember',
        'judgings.runs',
        'judgings.runs.testcase',
      ],
    });
  }
}
