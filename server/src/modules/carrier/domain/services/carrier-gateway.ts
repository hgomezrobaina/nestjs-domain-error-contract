import { Shipment } from "../../../shipment/domain/core/shipment.entity"
import { Carrier } from "../core/carrier.entity"
import { ShipmentLabel } from "../core/shipment-label"

// Talking to the carrier can fail in three ways the server tells apart:
// CarrierRateLimitException, CarrierConnectionErrorException, CarrierErrorException.
export interface CarrierGateway {
  label(shipment: Shipment, carrier: Carrier): Promise<ShipmentLabel>
}
