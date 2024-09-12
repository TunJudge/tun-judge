import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { MainInitializer } from './core/initializers/main.initializer';
import { LogClass } from './core/log.decorator';

@LogClass
@Injectable()
export class AppService {
  constructor(
    @InjectConnection() connection: Connection,
    private readonly initializer: MainInitializer
  ) {
    connection.transaction((entityManager) => this.initializer.run(entityManager));
  }
}
