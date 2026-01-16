import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IncomingMessage } from 'http';
import crypto from 'crypto';
import { ServerResponse } from 'http';
import { databaseConfig, jwtConfig } from './config';
import { DatabaseModule } from './database';
import {
  UsersModule,
  AuthModule,
  CatalogModule,
  CartModule,
  OrdersModule,
} from './modules';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
                  singleLine: true,
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        messageKey: 'message',
        genReqId: (req: IncomingMessage) => {
          const xRequestId = req.headers['x-request-id'];
          return typeof xRequestId === 'string'
            ? xRequestId
            : crypto.randomUUID();
        },
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
          censor: '[REDACTED]',
        },
        serializers: {
          req: (req: IncomingMessage) => ({
            method: req.method,
            url: req.url,
            headers: req.headers,
          }),
          res: (res: ServerResponse<IncomingMessage>) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CatalogModule,
    CartModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
