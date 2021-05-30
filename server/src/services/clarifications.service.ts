import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { Clarification, ClarificationMessage } from '../entities';

@Injectable()
export class ClarificationsService {
  constructor(
    @InjectRepository(Clarification)
    private readonly clarificationsRepository: ExtendedRepository<Clarification>,
    @InjectRepository(ClarificationMessage)
    private readonly clarificationMessagesRepository: ExtendedRepository<ClarificationMessage>,
  ) {}

  getByContestId(contestId: number): Promise<Clarification[]> {
    return this.clarificationsRepository.find({ contest: { id: contestId } });
  }

  getByContestIdAndTeamId(contestId: number, teamId: number): Promise<Clarification[]> {
    return this.clarificationsRepository.find({
      where: { contest: { id: contestId }, team: { id: teamId } },
      relations: ['problem', 'messages', 'messages.sentBy'],
    });
  }

  getByIdAndContestId(id: number, contestId: number): Promise<Clarification> {
    return this.clarificationsRepository.findOneOrThrow(
      {
        where: { id, contest: { id: contestId } },
        relations: ['problem', 'messages', 'messages.sentBy'],
      },
      new NotFoundException('Clarification not found!'),
    );
  }

  save(clarification: Clarification): Promise<Clarification> {
    return this.clarificationsRepository.save(clarification);
  }

  saveMessage(message: ClarificationMessage): Promise<ClarificationMessage> {
    return this.clarificationMessagesRepository.save(message);
  }
}
