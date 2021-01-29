import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppGateway } from './app.gateway';
import { AuthModule } from './auth/auth.module';
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
import { CustomRepositoryProviders } from './core/extended-repository';
import { RolesGuard } from './core/guards';
import { entities } from './entities';
import {
  AppService,
  ContestProblemsService,
  ContestsService,
  ExecutablesService,
  FilesService,
  JudgeHostsService,
  JudgingRunsService,
  JudgingsService,
  LanguagesService,
  ProblemsService,
  ScoreboardService,
  SubmissionsService,
  TeamCategoriesService,
  TeamsService,
  TestcasesService,
  UsersService,
} from './services';
import {
  ContestProblemTransformer,
  ContestTransformer,
  ExecutableTransformer,
  LanguageTransformer,
  ProblemTransformer,
  TeamTransformer,
  TestcaseTransformer,
} from './transformers';

const CONTROLLERS = [
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
];

const SERVICES = [
  AppService,
  ContestProblemsService,
  ContestsService,
  ExecutablesService,
  FilesService,
  JudgeHostsService,
  JudgingRunsService,
  JudgingsService,
  LanguagesService,
  ProblemsService,
  ScoreboardService,
  SubmissionsService,
  TeamCategoriesService,
  TeamsService,
  TestcasesService,
  UsersService,
];

const TRANSFORMERS = [
  ContestProblemTransformer,
  ContestTransformer,
  ExecutableTransformer,
  LanguageTransformer,
  ProblemTransformer,
  TeamTransformer,
  TestcaseTransformer,
];

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
  controllers: [...CONTROLLERS],
  providers: [
    AppGateway,
    ...SERVICES,
    ...TRANSFORMERS,
    ...CustomRepositoryProviders,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
