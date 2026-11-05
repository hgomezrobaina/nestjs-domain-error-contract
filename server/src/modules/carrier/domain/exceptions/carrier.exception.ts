import { HttpStatus } from "@nestjs/common";
import { AppHttpException } from "../../../app/domain/exception/app-http.exception";

// Three codes on purpose: in the log they are three different investigations.
// The client shows the three of them with one sentence.

export class CarrierNotFoundException extends AppHttpException {
  status(): HttpStatus {
    return HttpStatus.NOT_FOUND;
  }

  code(): string {
    return "carrier-not-found";
  }

  content(): string {
    return "The carrier does not exist";
  }
}

export class CarrierRateLimitException extends AppHttpException {
  status(): HttpStatus {
    return HttpStatus.BAD_GATEWAY;
  }

  code(): string {
    return "carrier-rate-limit";
  }

  content(): string {
    return "The carrier rejected the request because of its own rate limit";
  }
}

export class CarrierConnectionErrorException extends AppHttpException {
  status(): HttpStatus {
    return HttpStatus.BAD_GATEWAY;
  }

  code(): string {
    return "carrier-connection-error";
  }

  content(): string {
    return "The connection with the carrier failed";
  }
}

export class CarrierErrorException extends AppHttpException {
  status(): HttpStatus {
    return HttpStatus.BAD_GATEWAY;
  }

  code(): string {
    return "carrier-error";
  }

  content(): string {
    return "The carrier answered with an error";
  }
}
