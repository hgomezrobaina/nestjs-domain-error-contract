import { Module } from "@nestjs/common"
import { CarrierMemoryRepository } from "../../../../carrier/infrastructure/memory/carrier-memory.repository"
import { FakeCarrierGateway } from "../../../../carrier/infrastructure/memory/fake-carrier.gateway"
import { ShipmentMemoryRepository } from "../../memory/shipment-memory.repository"
import { ShipmentController } from "../controller/shipment.controller"

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentMemoryRepository, CarrierMemoryRepository, FakeCarrierGateway],
})
export class ShipmentModule {}
