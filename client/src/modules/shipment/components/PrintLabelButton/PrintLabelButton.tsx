import usePrintLabelButton from "./hooks/usePrintLabelButton";

interface Props {
  shipmentId: string;
  carrierId: string;
}

export default function PrintLabelButton({ shipmentId, carrierId }: Props) {
  const { loading, handlePrint } = usePrintLabelButton({
    shipmentId,
    carrierId,
  });

  return (
    <button disabled={loading} onClick={handlePrint}>
      Print label
    </button>
  );
}
