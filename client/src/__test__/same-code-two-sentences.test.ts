import { dispatchShipment } from "@modules/shipment/services/dispatch-shipment";
import { printShipmentLabel } from "@modules/shipment/services/print-shipment-label";
import { describe, expect, it } from "vitest";
import { serveFixture } from "./utils/serve-fixture";

const REQUEST = { shipmentId: "s-light", carrierId: "c-road" };

describe("the map from code to sentence is not one to one", () => {
  it("one code, two sentences: too-many-requests depends on the operation", async () => {
    serveFixture("too-many-requests.default");
    const dispatching = await dispatchShipment(REQUEST);

    serveFixture("too-many-requests.labels");
    const printing = await printShipmentLabel(REQUEST);

    expect(dispatching.errors?.[0].code()).toBe("too-many-requests");
    expect(printing.errors?.[0].code()).toBe("too-many-requests");

    expect(dispatching.errors?.[0].message().es).toBe(
      "Demasiados intentos. Inténtalo de nuevo en unos minutos.",
    );
    expect(printing.errors?.[0].message().es).toBe(
      "Has impreso las tres etiquetas que permite esta hora.",
    );
  });

  it("three codes, one sentence: the carrier failures collapse for whoever reads them", async () => {
    const results = [];

    for (const name of [
      "carrier-rate-limit",
      "carrier-connection-error",
      "carrier-error",
    ]) {
      serveFixture(name);
      results.push(await printShipmentLabel(REQUEST));
    }

    const codes = results.map((r) => r.errors?.[0].code());
    const sentences = new Set(results.map((r) => r.errors?.[0].message().es));

    expect(codes).toEqual([
      "carrier-rate-limit",
      "carrier-connection-error",
      "carrier-error",
    ]);
    expect([...sentences]).toEqual([
      "El transportista no respondió. Inténtalo de nuevo.",
    ]);
  });

  it("the same domain exception reads the same in two operations", async () => {
    serveFixture("shipment-already-dispatched");
    const dispatching = await dispatchShipment(REQUEST);

    serveFixture("shipment-already-dispatched.label");
    const printing = await printShipmentLabel(REQUEST);

    expect(dispatching.errors?.[0].message()).toEqual(
      printing.errors?.[0].message(),
    );
  });
});
