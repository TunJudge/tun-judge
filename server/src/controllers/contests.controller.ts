import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { Contest } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('contests')
@UseGuards(AuthenticatedGuard)
export class ContestsController {
  constructor(
    @InjectRepository(Contest)
    private readonly contestsRepository: ExtendedRepository<Contest>,
  ) {}

  @Get()
  getAll(): Promise<Contest[]> {
    return this.contestsRepository.find({
      relations: ['problems'],
      order: { id: 'ASC' },
    });
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() contest: Contest): Promise<Contest> {
    return this.contestsRepository.save(contest);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: number,
    @Body() contest: Contest,
  ): Promise<Contest> {
    const oldContest = await this.contestsRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    return this.contestsRepository.save({ ...oldContest, ...contest });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number): Promise<void> {
    await this.contestsRepository.delete(id);
  }
}
