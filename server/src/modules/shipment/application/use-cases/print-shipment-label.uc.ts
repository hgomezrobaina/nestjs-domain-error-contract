import { CarrierRepository } from "../../../carrier/domain/repository/carrier.repository"
import { CarrierNotFoundException } from "../../../carrier/domain/exceptions/carrier.exception"
import { CarrierGateway } from "../../../carrier/domain/services/carrier-gateway"
import { ShipmentLabel } from "../../../carrier/domain/core/shipment-label"
import { ShipmentRepository } from "../../domain/repository/shipment.repository"
import {
  ShipmentAlreadyDispatchedException,
  ShipmentNotFoundException,
} from "../../domain/exceptions/shipment.exception"

interface Props {
  shipmentId: string
  carrierId: string
}

export class PrintShipmentLabelUseCase {
  constructor(
    private readonly shipments: ShipmentRepository,
    private readonly carriers: CarrierRepository,
    private readonly gateway: CarrierGateway,
  ) {}

  async execute({ shipmentId, carrierId }: Props): Promise<ShipmentLabel> {
    const shipment = await this.shipments.findById(shipmentId)

    if (shipment === null) {
      throw new ShipmentNotFoundException()
    }

    // Once the shipment has left, its label is final.
    if (shipment.dispatchedAt !== null) {
      throw new ShipmentAlreadyDispatchedException()
    }

    const carrier = await this.carriers.findById(carrierId)

    if (carrier === null) {
      throw new CarrierNotFoundException()
    }

    return this.gateway.label(shipment, carrier)
  }
}
