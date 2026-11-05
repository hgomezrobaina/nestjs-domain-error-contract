import { CARRIERS, SHIPMENTS } from "../../constants/desk";
import DispatchButton from "../DispatchButton/DispatchButton";
import PrintLabelButton from "../PrintLabelButton/PrintLabelButton";
import useShipmentDesk from "./hooks/useShipmentDesk";

export default function ShipmentDesk() {
  const { shipmentId, carrierId, setShipmentId, setCarrierId } =
    useShipmentDesk();

  return (
    <section className="desk">
      <label>
        Shipment
        <select
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
        >
          {SHIPMENTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Carrier
        <select
          value={carrierId}
          onChange={(e) => setCarrierId(e.target.value)}
        >
          {CARRIERS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <div className="actions">
        <DispatchButton shipmentId={shipmentId} carrierId={carrierId} />
        <PrintLabelButton shipmentId={shipmentId} carrierId={carrierId} />
      </div>
    </section>
  );
}
