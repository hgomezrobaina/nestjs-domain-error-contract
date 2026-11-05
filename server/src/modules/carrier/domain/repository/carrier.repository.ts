import { Carrier } from "../core/carrier.entity"

export interface CarrierRepository {
  findById(id: string): Promise<Carrier | null>
}
