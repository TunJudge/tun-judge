import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtendedRepository } from '../../core/extended-repository';
import { LogClass } from '../../core/log.decorator';
import { Clarification, ClarificationMessage } from '../../entities';

@LogClass
@Injectable()
export class ClarificationsService {
  constructor(
    @InjectRepository(Clarification)
    private readonly clarificationsRepository: ExtendedRepository<Clarification>,
    @InjectRepository(ClarificationMessage)
    private readonly clarificationMessagesRepository: ExtendedRepository<ClarificationMessage>
  ) {}

  getByContestId(contestId: number): Promise<Clarification[]> {
    return this.clarificationsRepository.find({
      where: { contest: { id: contestId } },
      relations: ['team', 'problem', 'messages', 'messages.sentBy', 'messages.seenBy'],
    });
  }

  getByContestIdAndTeamId(contestId: number, teamId: number): Promise<Clarification[]> {
    return this.getByContestId(contestId).then((result) =>
      result.filter((item) => !item.team || item.team.id === teamId)
    );
  }

  getByIdAndContestId(id: number, contestId: number): Promise<Clarification> {
    return this.clarificationsRepository.findOneOrThrow(
      {
        where: { id, contest: { id: contestId } },
        relations: ['team', 'problem', 'messages', 'messages.sentBy', 'messages.seenBy'],
      },
      new NotFoundException('Clarification not found!')
    );
  }

  getMessageByClarificationIdAndContestId(
    id: number,
    clarificationId: number,
    contestId: number
  ): Promise<ClarificationMessage> {
    return this.clarificationMessagesRepository.findOneOrFail({
      where: { id, clarification: { id: clarificationId, contest: { id: contestId } } },
      relations: ['sentBy', 'clarification', 'clarification.contest', 'seenBy'],
    });
  }

  save(clarification: Clarification): Promise<Clarification> {
    return this.clarificationsRepository.save(clarification);
  }

  saveMessage(message: ClarificationMessage): Promise<ClarificationMessage> {
    return this.clarificationMessagesRepository.save(message);
  }
}
