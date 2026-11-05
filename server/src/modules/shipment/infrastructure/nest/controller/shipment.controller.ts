import { Body, Controller, HttpCode, HttpStatus, Param, Post } from "@nestjs/common"
import { SkipThrottle } from "@nestjs/throttler"
import { CarrierMemoryRepository } from "../../../../carrier/infrastructure/memory/carrier-memory.repository"
import { FakeCarrierGateway } from "../../../../carrier/infrastructure/memory/fake-carrier.gateway"
import { ShipmentLabel } from "../../../../carrier/domain/core/shipment-label"
import { DispatchShipmentRequest } from "../../../application/dto/write/dispatch-shipment.request"
import { PrintShipmentLabelRequest } from "../../../application/dto/write/print-shipment-label.request"
import { DispatchShipmentUseCase } from "../../../application/use-cases/dispatch-shipment.uc"
import { PrintShipmentLabelUseCase } from "../../../application/use-cases/print-shipment-label.uc"
import { ShipmentMemoryRepository } from "../../memory/shipment-memory.repository"

// The "labels" limit (3 per hour) only applies to printing a label.
// The "default" limit (100 per minute) applies to everything.
@Controller("shipments")
@SkipThrottle({ labels: true })
export class ShipmentController {
  constructor(
    private readonly shipments: ShipmentMemoryRepository,
    private readonly carriers: CarrierMemoryRepository,
    private readonly gateway: FakeCarrierGateway,
  ) {}

  @Post("dispatch")
  @HttpCode(HttpStatus.NO_CONTENT)
  async dispatch(@Body() body: DispatchShipmentRequest): Promise<void> {
    const useCase = new DispatchShipmentUseCase(this.shipments, this.carriers)

    await useCase.execute({ shipmentId: body.shipmentId, carrierId: body.carrierId })
  }

  @Post(":id/label")
  @SkipThrottle({ labels: false })
  async label(
    @Param("id") id: string,
    @Body() body: PrintShipmentLabelRequest,
  ): Promise<ShipmentLabel> {
    const useCase = new PrintShipmentLabelUseCase(this.shipments, this.carriers, this.gateway)

    return useCase.execute({ shipmentId: id, carrierId: body.carrierId })
  }
}
