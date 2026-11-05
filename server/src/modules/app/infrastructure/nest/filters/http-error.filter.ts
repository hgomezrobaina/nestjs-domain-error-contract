import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AppHttpException } from "../../../domain/exception/app-http.exception";
import { AppErrorResponse } from "../../../domain/exception/app-error-response.exception";
import { PinoLogger } from "../logger/pino-logger";

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const error = this.build(exception);

    this.logger.warn({
      message: error.message,
      context: AppExceptionFilter.name,
      data: {
        status: error.status,
        code: error.code,
        path: request.url,
        params: error.params,
      },
    });

    ctx.getResponse().status(error.status).json({
      time: new Date().toISOString(),
      path: request.url,
      status: error.status,
      error: error,
    });
  }

  private build(exception: unknown): AppErrorResponse {
    if (exception instanceof AppHttpException) {
      return exception.response();
    }

    if (exception instanceof HttpException) {
      return this.fromHttpException(exception);
    }

    return {
      message: "There was an unexpected server error",
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: "internal-server-error",
      params: [],
    };
  }

  // Framework exceptions (a guard, a missing route) carry no domain code,
  // so one is derived from the status: 429 becomes "too-many-requests".
  private fromHttpException(exception: HttpException): AppErrorResponse {
    const status = exception.getStatus();
    const name = HttpStatus[status] as string | undefined;

    return {
      message: exception.message,
      status: status,
      code: name ? name.toLowerCase().replace(/_/g, "-") : "unknown-error",
      params: [],
    };
  }
}
