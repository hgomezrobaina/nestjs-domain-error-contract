import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ShipmentModule } from "../../../../shipment/infrastructure/nest/module/shipment.module";
import { AppExceptionFilter } from "../filters/http-error.filter";
import { PinoLogger } from "../logger/pino-logger";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

@Module({
  imports: [
    // Two limits over the same API, and both answer 429 "too-many-requests".
    ThrottlerModule.forRoot([
      { name: "default", ttl: MINUTE, limit: 100 },
      { name: "labels", ttl: HOUR, limit: 3 },
    ]),
    ShipmentModule,
  ],
  providers: [
    PinoLogger,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: AppExceptionFilter },
  ],
})
export class AppModule {}
