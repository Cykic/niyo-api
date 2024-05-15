import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ERROR_MESSAGE } from '../constant/validation-error-message.constant';
import { prettify, ucfirst } from '../utils/string.util';
import { Response } from 'express';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  logger = new Logger('Error Filter');

  constructor() {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    let exceptionResource: any;

    switch (status) {
      case 400:
        exceptionResource = (
          exception as BadRequestException
        ).getResponse() as any;
        message =
          typeof exceptionResource?.message === 'string'
            ? `${exceptionResource.message}`
            : `${ucfirst(prettify(exceptionResource.message[0] ?? ''))}`;

        break;
      case 503:
        exceptionResource = (
          exception as BadRequestException
        ).getResponse() as any;
        message = 'Service currently unavailable, try again later';
        break;
      default:
        message = (exception as any)?.message ?? ERROR_MESSAGE.FINAL_ERROR;
        break;
    }

    if (status >= 400 && status < 500) {
      this.logger.log(exception as Error);
      response.status(status).json({
        statusCode: status,
        message,
      });
    } else {
      console.log(exception);
      this.logger.log(exception as Error);
      response.status(status).json({
        statusCode: status,
        message,
      });
    }
  }
}
