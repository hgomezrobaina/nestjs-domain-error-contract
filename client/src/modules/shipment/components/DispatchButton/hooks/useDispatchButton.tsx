import useToast from "@modules/app/modules/toast/hooks/useToast";
import { useState } from "react";
import { dispatchShipment } from "../../../services/dispatch-shipment";

interface Props {
  shipmentId: string;
  carrierId: string;
}

export default function useDispatchButton({ shipmentId, carrierId }: Props) {
  const { toastAppError, toastSuccess } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDispatch() {
    setLoading(true);

    const { errors } = await dispatchShipment({ shipmentId, carrierId });

    setLoading(false);

    if (errors) {
      toastAppError(errors);
    } else {
      toastSuccess({
        message: { en: "Shipment dispatched.", es: "Envío despachado." },
      });
    }
  }

  return { loading, handleDispatch };
}
