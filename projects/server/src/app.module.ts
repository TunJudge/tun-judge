import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './core/config';
import { InitializersModule } from './core/initializers/initializers.module';
import { entities } from './entities';
import { AuthModule } from './features/auth/auth.module';
import { ClarificationsModule } from './features/clarifications/clarifications.module';
import { ContestsModule } from './features/contests/contests.module';
import { ExecutablesModule } from './features/executables/executables.module';
import { FilesModule } from './features/files/files.module';
import { JudgeHostsModule } from './features/judge-hosts/judge-hosts.module';
import { LanguagesModule } from './features/languages/languages.module';
import { ProblemsModule } from './features/problems/problems.module';
import { PublicModule } from './features/public/public.module';
import { ScoreboardModule } from './features/scoreboard/scoreboard.module';
import { SubmissionsModule } from './features/submissions/submissions.module';
import { TeamCategoriesModule } from './features/team-categories/team-categories.module';
import { TeamsModule } from './features/teams/teams.module';
import { TestcasesModule } from './features/testcases/testcases.module';
import { UsersModule } from './features/users/users.module';
import { WebsocketModule } from './features/websocket/websocket.module';
import { RolesGuard } from './guards';
import { migrations } from './migrations';

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
      migrations: migrations,
      migrationsRun: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client'),
      exclude: ['/api*', '/documentation*'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'docs'),
      serveRoot: '/documentation',
      exclude: ['/api*'],
    }),
    InitializersModule,
    AuthModule,
    ClarificationsModule,
    ContestsModule,
    ExecutablesModule,
    JudgeHostsModule,
    FilesModule,
    LanguagesModule,
    ProblemsModule,
    PublicModule,
    ScoreboardModule,
    SubmissionsModule,
    TeamsModule,
    TeamCategoriesModule,
    TestcasesModule,
    UsersModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
