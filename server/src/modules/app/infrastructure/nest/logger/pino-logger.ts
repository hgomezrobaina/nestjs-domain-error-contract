import { Injectable } from "@nestjs/common";
import pino from "pino";

interface LogProps {
  message: string;
  context: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class PinoLogger {
  private readonly logger = pino({ level: process.env.LOG_LEVEL ?? "info" });

  warn({ message, context, data }: LogProps): void {
    this.logger.warn({ context, data }, message);
  }
}
