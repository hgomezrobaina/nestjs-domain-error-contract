export interface DispatchHttpErrorParam {
  name: string
  value: string
}

// The error already normalised: nothing in the client's domain sees an axios error.
export interface DispatchHttpError {
  message: string
  status: number
  code: string
  params: DispatchHttpErrorParam[]
}

export function unknownError(): DispatchHttpError {
  return { message: "", status: 500, code: "", params: [] }
}
