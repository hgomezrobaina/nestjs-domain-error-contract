import { Injectable } from "@nestjs/common";
import { Shipment } from "../../../shipment/domain/core/shipment.entity";
import { Carrier } from "../../domain/core/carrier.entity";
import { ShipmentLabel } from "../../domain/core/shipment-label";
import { CarrierGateway } from "../../domain/services/carrier-gateway";
import {
  CarrierConnectionErrorException,
  CarrierErrorException,
  CarrierRateLimitException,
} from "../../domain/exceptions/carrier.exception";

// Stands in for a real carrier API. Three of the seeded carriers fail on
// purpose, one per failure mode, so the example can show them.
@Injectable()
export class FakeCarrierGateway implements CarrierGateway {
  async label(shipment: Shipment, carrier: Carrier): Promise<ShipmentLabel> {
    if (carrier.id === "c-busy") {
      throw new CarrierRateLimitException();
    }

    if (carrier.id === "c-offline") {
      throw new CarrierConnectionErrorException();
    }

    if (carrier.id === "c-broken") {
      throw new CarrierErrorException();
    }

    return {
      trackingNumber: `${carrier.id}-${shipment.id}`,
      carrierId: carrier.id,
    };
  }
}
