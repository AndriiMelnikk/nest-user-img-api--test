import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { unlink } from 'fs/promises';

@Catch()
export class FileCleanupExceptionFilter implements ExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const file = (request as any).file as Express.Multer.File | undefined;
    if (file?.path) {
      try {
        await unlink(file.path);
      } catch (error) {
        console.error('Помилка при видаленні файлу:', error);
      }
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (
        typeof responseBody === 'object' &&
        (responseBody as any).message &&
        Array.isArray((responseBody as any).message)
      ) {
        return response.status(status).json({
          statusCode: status,
          error: (responseBody as any).error || 'Validation Error',
          message: (responseBody as any).message,
        });
      }
      return response.status(status).json(responseBody);
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
