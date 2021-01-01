import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';

@Controller('judge-hosts')
@UseGuards(AuthenticatedGuard)
export class JudgeHostsController {
  @Get()
  hello(): string {
    return 'hello';
  }
}
