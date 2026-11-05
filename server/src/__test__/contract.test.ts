import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "./utils/create-app";
import { fixture, withoutTime } from "./utils/fixture";

describe("the error contract on the wire", () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app.close();
  });

  function dispatch(shipmentId: string, carrierId: string) {
    return request(app.getHttpServer())
      .post("/shipments/dispatch")
      .send({ shipmentId, carrierId });
  }

  function label(shipmentId: string, carrierId: string) {
    return request(app.getHttpServer())
      .post(`/shipments/${shipmentId}/label`)
      .send({ carrierId });
  }

  function expectContract(response: request.Response, name: string) {
    const expected = fixture(name);

    expect(response.status).toBe(expected.status);
    expect(withoutTime(response.body)).toEqual(expected.body);
    expect(new Date(response.body.time).toISOString()).toBe(response.body.time);
  }

  describe("domain exceptions name the failure and carry its data apart from the text", () => {
    it("sends the weight limit and the actual weight as named params", async () => {
      expectContract(
        await dispatch("s-heavy", "c-road"),
        "shipment-weight-exceeded",
      );
    });

    it("sends an empty params list when there is nothing to tell", async () => {
      expectContract(
        await dispatch("s-sent", "c-road"),
        "shipment-already-dispatched",
      );
    });

    it("sends the uncovered country as a param", async () => {
      expectContract(
        await dispatch("s-iceland", "c-road"),
        "destination-not-covered",
      );
    });

    it("sends codes the client never mirrors in the same shape", async () => {
      expectContract(await dispatch("missing", "c-road"), "shipment-not-found");
    });
  });

  describe("one domain exception, thrown by two operations", () => {
    it("refuses a new label for a shipment that already left, with the same code", async () => {
      expectContract(
        await label("s-sent", "c-road"),
        "shipment-already-dispatched.label",
      );
    });
  });

  describe("framework exceptions get a code derived from their status", () => {
    it("turns an unknown route into not-found", async () => {
      expectContract(
        await request(app.getHttpServer()).get("/nowhere"),
        "not-found",
      );
    });
  });

  describe("three carrier failures keep three codes", () => {
    it.each([
      ["c-offline", "carrier-connection-error"],
      ["c-busy", "carrier-rate-limit"],
      ["c-broken", "carrier-error"],
    ])("carrier %s fails with %s", async (carrierId, name) => {
      expectContract(await label("s-light", carrierId), name);
    });
  });

  describe("two different limits answer with the same code", () => {
    it("the labels limit (3 per hour) answers too-many-requests on the 4th label", async () => {
      for (let i = 0; i < 3; i++) {
        expect((await label("s-light", "c-road")).status).toBe(201);
      }

      expectContract(
        await label("s-light", "c-road"),
        "too-many-requests.labels",
      );
    });

    it("the labels limit does not apply to dispatching", async () => {
      for (let i = 0; i < 4; i++) {
        await label("s-light", "c-road");
      }

      expect((await dispatch("s-light", "c-road")).status).toBe(204);
    });

    it("the default limit (100 per minute) answers too-many-requests on the 101st request", async () => {
      for (let i = 0; i < 100; i++) {
        expect((await dispatch("missing", "c-road")).status).toBe(404);
      }

      expectContract(
        await dispatch("missing", "c-road"),
        "too-many-requests.default",
      );
    });

    it("both limits share the code, so the server cannot tell the client which one it was", () => {
      const labels = fixture("too-many-requests.labels").body.error as {
        code: string;
      };
      const global = fixture("too-many-requests.default").body.error as {
        code: string;
      };

      expect(labels.code).toBe(global.code);
    });
  });
});
