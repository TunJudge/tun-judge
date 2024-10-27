import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackModule } from '@zenstackhq/server/nestjs';
import { ClsModule, ClsService } from 'nestjs-cls';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthInterceptor } from './auth';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule, PrismaService } from './db';
import { FilesModule } from './files';
import { RolesGuard } from './guards';
import { InitializersModule } from './initializers';
import { RequestLoggerMiddleware } from './logger';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*', '/docs*'],
    }),
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'docs'),
      serveRoot: '/docs',
      exclude: ['/api*'],
    }),
    ZenStackModule.registerAsync({
      global: true,
      useFactory: (prisma: PrismaService, cls: ClsService) => ({
        getEnhancedPrisma: () => enhance(prisma, { user: cls.get('auth') }),
      }),
      inject: [PrismaService, ClsService],
      extraProviders: [PrismaService],
    }),
    DatabaseModule,
    InitializersModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: AuthInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}