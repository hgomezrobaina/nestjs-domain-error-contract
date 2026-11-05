import { HttpStatus } from "@nestjs/common";
import {
  AppHttpErrorParam,
  AppHttpException,
} from "../../../app/domain/exception/app-http.exception";

export class ShipmentNotFoundException extends AppHttpException {
  status(): HttpStatus {
    return HttpStatus.NOT_FOUND;
  }

  code(): string {
    return "shipment-not-found";
  }

  content(): string {
    return "The shipment does not exist";
  }
}

export class ShipmentAlreadyDispatchedException extends AppHttpException {
  status(): HttpStatus {
    return HttpStatus.CONFLICT;
  }

  code(): string {
    return "shipment-already-dispatched";
  }

  content(): string {
    return "The shipment was already dispatched";
  }
}

export class ShipmentWeightExceededException extends AppHttpException {
  constructor(
    private readonly maxWeight: number,
    private readonly actual: number,
  ) {
    super();
  }

  status(): HttpStatus {
    return HttpStatus.CONFLICT;
  }

  code(): string {
    return "shipment-weight-exceeded";
  }

  content(): string {
    return "The shipment weight exceeds what the carrier accepts";
  }

  params(): AppHttpErrorParam[] {
    return [
      { name: "maxWeight", value: String(this.maxWeight) },
      { name: "actual", value: String(this.actual) },
    ];
  }
}

export class DestinationNotCoveredException extends AppHttpException {
  constructor(private readonly country: string) {
    super();
  }

  status(): HttpStatus {
    return HttpStatus.UNPROCESSABLE_ENTITY;
  }

  code(): string {
    return "destination-not-covered";
  }

  content(): string {
    return "The carrier does not deliver to the shipment destination";
  }

  params(): AppHttpErrorParam[] {
    return [{ name: "country", value: this.country }];
  }
}
