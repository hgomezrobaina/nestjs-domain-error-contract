import { CarrierRepository } from "../../../carrier/domain/repository/carrier.repository"
import { CarrierNotFoundException } from "../../../carrier/domain/exceptions/carrier.exception"
import { ShipmentRepository } from "../../domain/repository/shipment.repository"
import {
  DestinationNotCoveredException,
  ShipmentAlreadyDispatchedException,
  ShipmentNotFoundException,
  ShipmentWeightExceededException,
} from "../../domain/exceptions/shipment.exception"

interface Props {
  shipmentId: string
  carrierId: string
}

export class DispatchShipmentUseCase {
  constructor(
    private readonly shipments: ShipmentRepository,
    private readonly carriers: CarrierRepository,
  ) {}

  async execute({ shipmentId, carrierId }: Props): Promise<void> {
    const shipment = await this.shipments.findById(shipmentId)

    if (shipment === null) {
      throw new ShipmentNotFoundException()
    }

    const carrier = await this.carriers.findById(carrierId)

    if (carrier === null) {
      throw new CarrierNotFoundException()
    }

    if (shipment.dispatchedAt !== null) {
      throw new ShipmentAlreadyDispatchedException()
    }

    if (shipment.weight > carrier.maxWeight) {
      throw new ShipmentWeightExceededException(carrier.maxWeight, shipment.weight)
    }

    if (!carrier.covers(shipment.destination)) {
      throw new DestinationNotCoveredException(shipment.destination)
    }

    shipment.dispatch(new Date())

    await this.shipments.save(shipment)
  }
}
