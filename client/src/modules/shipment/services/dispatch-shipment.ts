import { COMMON_HTTP_EXCEPTIONS } from "@modules/app/domain/exceptions/common-http-exceptions"
import { DispatchError } from "@modules/app/domain/exceptions/dispatch-error"
import { DispatchHttpExceptionResolver } from "@modules/app/domain/exceptions/dispatch-http-error-resolver"
import { DispatchHttpException } from "@modules/app/domain/exceptions/dispatch-http-exception"
import { DispatchHttpError } from "@modules/app/modules/http/domain/http-error"
import { HttpResponseResult } from "@modules/app/modules/http/domain/http-response-result"
import { instance } from "@modules/app/modules/http/domain/instance"
import { DispatchShipmentError } from "../domain/errors/shipment-errors"
import {
  DestinationNotCoveredHttpException,
  ShipmentAlreadyDispatchedHttpException,
  ShipmentWeightExceededHttpException,
} from "../domain/exceptions/shipment-exceptions"
import { DispatchShipmentDTO } from "../dto/write/dispatch-shipment"

// POST /shipments/dispatch
// shipment-not-found and carrier-not-found are not declared on purpose: the desk
// only offers shipments and carriers that exist, so they fall back to default().
class DispatchShipmentExceptionResolver extends DispatchHttpExceptionResolver {
  protected errors(): DispatchHttpException[] {
    return [
      ...COMMON_HTTP_EXCEPTIONS,
      new ShipmentWeightExceededHttpException(),
      new ShipmentAlreadyDispatchedHttpException(),
      new DestinationNotCoveredHttpException(),
    ]
  }

  protected default(): DispatchError {
    return new DispatchShipmentError()
  }
}

export async function dispatchShipment(props: DispatchShipmentDTO): Promise<HttpResponseResult> {
  try {
    await instance.post("/shipments/dispatch", props)

    return { data: null, errors: null }
  } catch (e) {
    const resolver = new DispatchShipmentExceptionResolver()

    return { data: null, errors: resolver.execute(e as DispatchHttpError) }
  }
}
