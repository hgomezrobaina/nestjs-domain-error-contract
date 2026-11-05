import { useState } from "react"
import { CARRIERS, SHIPMENTS } from "../../../constants/desk"

export default function useShipmentDesk() {
  const [shipmentId, setShipmentId] = useState(SHIPMENTS[0].id)
  const [carrierId, setCarrierId] = useState(CARRIERS[0].id)

  return { shipmentId, carrierId, setShipmentId, setCarrierId }
}
