import { AppError } from "@modules/app/domain/exceptions/app-error";
import { AppHttpExceptionResolver } from "@modules/app/domain/exceptions/app-http-error-resolver";
import { AppHttpException } from "@modules/app/domain/exceptions/app-http-exception";
import { AppHttpError } from "@modules/app/modules/http/domain/http-error";
import { HttpResponseResult } from "@modules/app/modules/http/domain/http-response-result";
import { instance } from "@modules/app/modules/http/domain/instance";
import { CARRIER_HTTP_EXCEPTIONS } from "@modules/carrier/domain/exceptions/carrier-exceptions";
import { ShipmentLabel } from "../domain/core/shipment-label";
import { PrintLabelError } from "../domain/errors/shipment-errors";
import {
  ShipmentAlreadyDispatchedHttpException,
  TooManyLabelRequestsHttpException,
} from "../domain/exceptions/shipment-exceptions";
import { PrintShipmentLabelDTO } from "../dto/write/print-shipment-label";

// POST /shipments/:id/label
// Declares its own variant of too-many-requests, so it must NOT spread
// COMMON_HTTP_EXCEPTIONS: the generic sentence would come first and win.
class PrintLabelExceptionResolver extends AppHttpExceptionResolver {
  protected errors(): AppHttpException[] {
    return [
      new TooManyLabelRequestsHttpException(),
      new ShipmentAlreadyDispatchedHttpException(),
      ...CARRIER_HTTP_EXCEPTIONS,
    ];
  }

  protected default(): AppError {
    return new PrintLabelError();
  }
}

export async function printShipmentLabel({
  shipmentId,
  carrierId,
}: PrintShipmentLabelDTO): Promise<HttpResponseResult<ShipmentLabel>> {
  try {
    const { data } = await instance.post<ShipmentLabel>(
      `/shipments/${shipmentId}/label`,
      {
        carrierId,
      },
    );

    return { data, errors: null };
  } catch (e) {
    const resolver = new PrintLabelExceptionResolver();

    return { data: null, errors: resolver.execute(e as AppHttpError) };
  }
}
