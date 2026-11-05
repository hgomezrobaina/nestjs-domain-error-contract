import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { DispatchHttpException } from "../../../domain/exception/dispatch-http.exception"
import {
  DispatchErrorResponse,
  unexpectedErrorResponse,
} from "../../../domain/exception/dispatch-error-response.exception"
import { PinoLogger } from "../logger/pino-logger"

@Catch()
export class DispatchExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const error = this.build(exception)

    this.logger.warn({
      message: error.message,
      context: DispatchExceptionFilter.name,
      data: {
        status: error.status,
        code: error.code,
        path: request.url,
        params: error.params,
      },
    })

    ctx.getResponse().status(error.status).json({
      time: new Date().toISOString(),
      path: request.url,
      status: error.status,
      error: error,
    })
  }

  private build(exception: unknown): DispatchErrorResponse {
    if (exception instanceof DispatchHttpException) {
      return exception.response()
    }

    if (exception instanceof HttpException) {
      return this.fromHttpException(exception)
    }

    return unexpectedErrorResponse()
  }

  // Framework exceptions (a guard, a missing route) carry no domain code,
  // so one is derived from the status: 429 becomes "too-many-requests".
  private fromHttpException(exception: HttpException): DispatchErrorResponse {
    const status = exception.getStatus()
    const name = HttpStatus[status] as string | undefined

    return {
      message: exception.message,
      status: status,
      code: name ? name.toLowerCase().replace(/_/g, "-") : "unknown-error",
      params: [],
    }
  }
}
