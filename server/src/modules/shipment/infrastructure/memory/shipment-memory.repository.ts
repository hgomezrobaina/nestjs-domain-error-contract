import { Injectable } from "@nestjs/common";
import { Shipment } from "../../domain/core/shipment.entity";
import { ShipmentRepository } from "../../domain/repository/shipment.repository";

@Injectable()
export class ShipmentMemoryRepository implements ShipmentRepository {
  private readonly shipments = new Map<string, Shipment>([
    ["s-light", new Shipment("s-light", 12, "PT", null)],
    ["s-heavy", new Shipment("s-heavy", 32, "ES", null)],
    [
      "s-sent",
      new Shipment("s-sent", 8, "ES", new Date("2026-11-02T10:00:00.000Z")),
    ],
    ["s-iceland", new Shipment("s-iceland", 5, "IS", null)],
  ]);

  async findById(id: string): Promise<Shipment | null> {
    return this.shipments.get(id) ?? null;
  }

  async save(shipment: Shipment): Promise<void> {
    this.shipments.set(shipment.id, shipment);
  }
}
