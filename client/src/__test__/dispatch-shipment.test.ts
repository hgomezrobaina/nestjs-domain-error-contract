import { dispatchShipment } from "@modules/shipment/services/dispatch-shipment"
import { describe, expect, it } from "vitest"
import { serveFixture, serveNetworkFailure } from "./utils/serve-fixture"

const REQUEST = { shipmentId: "s-heavy", carrierId: "c-road" }

describe("dispatchShipment", () => {
  it("writes the sentence on the client with the data the server sent apart", async () => {
    serveFixture("shipment-weight-exceeded")

    const { errors } = await dispatchShipment(REQUEST)

    expect(errors?.map((e) => e.msg())).toEqual([
      {
        en: "This shipment weighs 32 kg and the carrier accepts 30.",
        es: "Este envío pesa 32 kg y el transportista admite 30.",
      },
    ])
  })

  it("writes the uncovered country into the sentence", async () => {
    serveFixture("destination-not-covered")

    const { errors } = await dispatchShipment(REQUEST)

    expect(errors?.[0].msg().es).toBe("Este transportista no entrega en IS. Elige otro.")
  })

  it("falls back to its operation's default for a code it does not declare", async () => {
    serveFixture("shipment-not-found")

    const { errors } = await dispatchShipment(REQUEST)

    expect(errors?.map((e) => e.id())).toEqual(["dispatch-shipment-error"])
    expect(errors?.[0].msg().es).toBe("No se pudo despachar el envío.")
  })

  it("falls back to the same default when the server never answered", async () => {
    serveNetworkFailure()

    const { errors } = await dispatchShipment(REQUEST)

    expect(errors?.map((e) => e.id())).toEqual(["dispatch-shipment-error"])
  })
})
