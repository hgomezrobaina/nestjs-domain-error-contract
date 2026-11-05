import { Shipment } from "../core/shipment.entity";

export interface ShipmentRepository {
  findById(id: string): Promise<Shipment | null>;
  save(shipment: Shipment): Promise<void>;
}
