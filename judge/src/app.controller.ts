import { Controller, Get } from '@nestjs/common';
import http from './http/http.client';
import { Submission } from './models';
import runner from './runner';

@Controller()
export class AppController {
  @Get()
  async run(): Promise<any> {
    const submission = await http.get<Submission>(
      'api/judge-hosts/localhost/next-submission',
    );
    return submission && runner.run(submission);
  }
}
