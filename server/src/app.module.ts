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
  ContestsController,
  LanguagesController,
  ProblemsController,
  TestcasesController,
  JudgeHostsController,
} from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOSTNAME,
      port: parseInt(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
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
    ContestsController,
    ProblemsController,
    TestcasesController,
    LanguagesController,
    JudgeHostsController,
  ],
  providers: [AppService, ...CustomRepositoryProviders],
})
export class AppModule {}
