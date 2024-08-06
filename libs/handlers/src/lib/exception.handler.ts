import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export const getStatusCode = (exception: any): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = (exception: any): string => {
  if (typeof exception === 'object') {
    return exception[0];
  }
  return exception;
};

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = getStatusCode(exception);
    const message = getErrorMessage(
      exception.response?.message || exception.response
    );
    const statusCode = exception.getStatus();

    const messageSplit = message.split(',').pop();

    response.status(code).json({
      statusCode,
      message: messageSplit,
      timestamp: new Date().toISOString(),
    });
  }
}
