import useDispatchButton from "./hooks/useDispatchButton"

interface Props {
  shipmentId: string
  carrierId: string
}

export default function DispatchButton({ shipmentId, carrierId }: Props) {
  const { loading, handleDispatch } = useDispatchButton({ shipmentId, carrierId })

  return (
    <button disabled={loading} onClick={handleDispatch}>
      Dispatch
    </button>
  )
}
