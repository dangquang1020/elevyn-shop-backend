import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = this.buildErrorResponse(exception, status, request);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).send(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    status: number,
    request: FastifyRequest,
  ): ErrorResponse {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message =
        typeof response === 'object' && 'message' in response
          ? (response as { message: string | string[] }).message
          : exception.message;

      return {
        statusCode: status,
        message,
        error: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    return {
      statusCode: status,
      message: 'Internal server error',
      error: 'InternalServerError',
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }
}
