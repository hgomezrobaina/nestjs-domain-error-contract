import useToast from "@modules/app/modules/toast/hooks/useToast";
import { useState } from "react";
import { printShipmentLabel } from "../../../services/print-shipment-label";

interface Props {
  shipmentId: string;
  carrierId: string;
}

export default function usePrintLabelButton({ shipmentId, carrierId }: Props) {
  const { toastAppError, toastSuccess } = useToast();
  const [loading, setLoading] = useState(false);

  async function handlePrint() {
    setLoading(true);

    const { data, errors } = await printShipmentLabel({
      shipmentId,
      carrierId,
    });

    setLoading(false);

    if (errors) {
      toastAppError(errors);
    } else {
      toastSuccess({
        message: {
          en: `Label printed: ${data.trackingNumber}`,
          es: `Etiqueta impresa: ${data.trackingNumber}`,
        },
      });
    }
  }

  return { loading, handlePrint };
}
