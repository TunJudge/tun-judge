import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app.service';
import { entities } from './entities';
import { AuthModule } from './auth/auth.module';
import { CustomRepositoryProviders } from './core/extended-repository';
import {
  AppController,
  RolesController,
  UsersController,
  TeamsController,
  PublicController,
  ContestsController,
  ProblemsController,
  LanguagesController,
  TestcasesController,
  JudgeHostsController,
  TeamCategoriesController,
} from './controllers';
import config from './core/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    TeamCategoriesController,
  ],
  providers: [AppService, ...CustomRepositoryProviders],
})
export class AppModule {}
