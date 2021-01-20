import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { AppService } from './app.service';
import { entities } from './entities';
import { AuthModule } from './auth/auth.module';
import { CustomRepositoryProviders } from './core/extended-repository';
import { ScoreboardService } from './scoreboard.service';
import {
  AppController,
  ContestsController,
  ExecutablesController,
  JudgeHostsController,
  LanguagesController,
  ProblemsController,
  PublicController,
  RolesController,
  SubmissionsController,
  TeamCategoriesController,
  TeamsController,
  TestcasesController,
  UsersController,
} from './controllers';
import config from './core/config';
import { RolesGuard } from './core/guards';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
      username: config.database.username,
      password: config.database.password,
      entities: entities,
      synchronize: true,
    }),
    TypeOrmModule.forFeature(entities),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    AuthModule,
  ],
  controllers: [
    AppController,
    RolesController,
    UsersController,
    TeamsController,
    PublicController,
    ContestsController,
    ProblemsController,
    TestcasesController,
    LanguagesController,
    JudgeHostsController,
    ExecutablesController,
    SubmissionsController,
    TeamCategoriesController,
  ],
  providers: [
    { provide: APP_GUARD, useClass: RolesGuard },
    AppService,
    ScoreboardService,
    ...CustomRepositoryProviders,
  ],
})
export class AppModule {}
