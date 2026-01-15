import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IncomingMessage } from 'http';
import crypto from 'crypto';
import { ServerResponse } from 'http';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
            // headers: res.headers,
          }),
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
