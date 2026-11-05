import { ArgumentsHost } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { AppExceptionFilter } from "../modules/app/infrastructure/nest/filters/http-error.filter";
import { PinoLogger } from "../modules/app/infrastructure/nest/logger/pino-logger";
import { ShipmentWeightExceededException } from "../modules/shipment/domain/exceptions/shipment.exception";

function fakeHost() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const host = {
    switchToHttp: () => ({
      getRequest: () => ({ url: "/shipments/dispatch" }),
      getResponse: () => ({ status }),
    }),
  } as unknown as ArgumentsHost;

  return { host, status, json };
}

function fakeLogger() {
  const warn = vi.fn();

  return { logger: { warn } as unknown as PinoLogger, warn };
}

describe("AppExceptionFilter", () => {
  it("answers anything it does not recognise with the last-resort error", () => {
    const { host, status, json } = fakeHost();
    const { logger } = fakeLogger();

    new AppExceptionFilter(logger).catch(new Error("database is gone"), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json.mock.calls[0][0].error).toEqual({
      message: "There was an unexpected server error",
      status: 500,
      code: "internal-server-error",
      params: [],
    });
  });

  it("never leaks the original message of an unexpected error", () => {
    const { host, json } = fakeHost();
    const { logger } = fakeLogger();

    new AppExceptionFilter(logger).catch(new Error("database is gone"), host);

    expect(JSON.stringify(json.mock.calls[0][0])).not.toContain(
      "database is gone",
    );
  });

  it("logs the params as a structured field, not inside the message", () => {
    const { host } = fakeHost();
    const { logger, warn } = fakeLogger();

    new AppExceptionFilter(logger).catch(
      new ShipmentWeightExceededException(30, 32),
      host,
    );

    expect(warn).toHaveBeenCalledWith({
      message: "The shipment weight exceeds what the carrier accepts",
      context: "AppExceptionFilter",
      data: {
        status: 409,
        code: "shipment-weight-exceeded",
        path: "/shipments/dispatch",
        params: [
          { name: "maxWeight", value: "30" },
          { name: "actual", value: "32" },
        ],
      },
    });
  });
});
