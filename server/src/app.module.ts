import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { entities } from './entities';
import { AuthModule } from './auth/auth.module';
import { CustomRepositoryProviders } from './core/extended-repository';

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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...CustomRepositoryProviders],
})
export class AppModule {}
