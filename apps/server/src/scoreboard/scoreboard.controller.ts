import { Controller, Patch, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard, Roles, RolesGuard } from '../guards';
import { LogClass } from '../logger';
import { ScoreboardService } from './scoreboard.service';

@LogClass
@Controller('api/scoreboard')
@UseGuards(AuthenticatedGuard, RolesGuard)
export class ScoreboardController {
  constructor(private readonly scoreboardService: ScoreboardService) {}

  @Patch('refresh-score-cache')
  @Roles('admin', 'jury', 'judge-host')
  refreshScoreCache() {
    return this.scoreboardService.refreshScores();
  }
}
