import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { HttpErrorBody } from '../interfaces/http-error-body.interface';
import type { Request, Response } from 'express';

@Catch()
export class ApplicationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApplicationExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message, stack } = this.normalize(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} ${message}`,
        stack ?? '',
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} ${String(message)}`);
    }

    const body: HttpErrorBody = {
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };
    response.status(status).json(body);
  }

  private normalize(exception: unknown): {
    status: number;
    message: string | string[];
    stack?: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === 'string'
          ? body
          : this.extractMessage(body as Record<string, unknown>);
      return {
        status,
        message,
        stack: status >= HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.stack
          : undefined,
      };
    }
    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        stack: exception.stack,
      };
    }
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  private extractMessage(body: Record<string, unknown>): string | string[] {
    const msg = body.message;
    if (typeof msg === 'string' || Array.isArray(msg)) {
      return msg;
    }
    return 'Error';
  }
}
