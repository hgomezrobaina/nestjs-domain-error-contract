import { Injectable } from "@nestjs/common"
import { Carrier } from "../../domain/core/carrier.entity"
import { CarrierRepository } from "../../domain/repository/carrier.repository"

const IBERIA = ["ES", "PT", "FR"]

@Injectable()
export class CarrierMemoryRepository implements CarrierRepository {
  private readonly carriers = new Map<string, Carrier>([
    ["c-road", new Carrier("c-road", 30, IBERIA)],
    ["c-busy", new Carrier("c-busy", 30, IBERIA)],
    ["c-offline", new Carrier("c-offline", 30, IBERIA)],
    ["c-broken", new Carrier("c-broken", 30, IBERIA)],
  ])

  async findById(id: string): Promise<Carrier | null> {
    return this.carriers.get(id) ?? null
  }
}
