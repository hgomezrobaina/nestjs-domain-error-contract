export interface AppHttpErrorParam {
  name: string;
  value: string;
}

// The error already normalised: nothing in the client's domain sees an axios error.
export interface AppHttpError {
  message: string;
  status: number;
  code: string;
  params: AppHttpErrorParam[];
}

export function unknownError(): AppHttpError {
  return { message: "", status: 500, code: "", params: [] };
}
