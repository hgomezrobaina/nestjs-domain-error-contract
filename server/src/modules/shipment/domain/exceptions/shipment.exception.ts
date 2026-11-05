import { HttpStatus } from "@nestjs/common"
import {
  DispatchHttpErrorParam,
  DispatchHttpException,
} from "../../../app/domain/exception/dispatch-http.exception"

export class ShipmentNotFoundException extends DispatchHttpException {
  status(): HttpStatus {
    return HttpStatus.NOT_FOUND
  }

  code(): string {
    return "shipment-not-found"
  }

  content(): string {
    return "The shipment does not exist"
  }
}

export class ShipmentAlreadyDispatchedException extends DispatchHttpException {
  status(): HttpStatus {
    return HttpStatus.CONFLICT
  }

  code(): string {
    return "shipment-already-dispatched"
  }

  content(): string {
    return "The shipment was already dispatched"
  }
}

export class ShipmentWeightExceededException extends DispatchHttpException {
  constructor(
    private readonly maxWeight: number,
    private readonly actual: number,
  ) {
    super()
  }

  status(): HttpStatus {
    return HttpStatus.CONFLICT
  }

  code(): string {
    return "shipment-weight-exceeded"
  }

  content(): string {
    return "The shipment weight exceeds what the carrier accepts"
  }

  params(): DispatchHttpErrorParam[] {
    return [
      { name: "maxWeight", value: String(this.maxWeight) },
      { name: "actual", value: String(this.actual) },
    ]
  }
}

export class DestinationNotCoveredException extends DispatchHttpException {
  constructor(private readonly country: string) {
    super()
  }

  status(): HttpStatus {
    return HttpStatus.UNPROCESSABLE_ENTITY
  }

  code(): string {
    return "destination-not-covered"
  }

  content(): string {
    return "The carrier does not deliver to the shipment destination"
  }

  params(): DispatchHttpErrorParam[] {
    return [{ name: "country", value: this.country }]
  }
}
