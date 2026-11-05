import {
  ConflictException,
  Controller,
  INestApplication,
  Post,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// NestJS 12 added `errorCode` to HttpException. This test shows both halves of
// what that gives you, with Nest's own filter and none of this repository's.
@Controller()
class FrameworkOnlyController {
  @Post("dispatch")
  dispatch() {
    throw new ConflictException(
      "The shipment weight exceeds what the carrier accepts",
      {
        errorCode: "shipment-weight-exceeded",
        cause: { maxWeight: 30, actual: 32 },
      },
    );
  }
}

describe("NestJS errorCode", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [FrameworkOnlyController],
    }).compile();

    app = module.createNestApplication({ logger: false });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("identifies the failure with a stable code the client can read", async () => {
    const response = await request(app.getHttpServer()).post("/dispatch");

    expect(response.body.errorCode).toBe("shipment-weight-exceeded");
  });

  it("has nowhere to put the failure data: the cause never reaches the client", async () => {
    const response = await request(app.getHttpServer()).post("/dispatch");

    expect(response.body).toEqual({
      statusCode: 409,
      message: "The shipment weight exceeds what the carrier accepts",
      error: "Conflict",
      errorCode: "shipment-weight-exceeded",
    });
  });
});
