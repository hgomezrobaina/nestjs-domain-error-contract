import { instance } from "@modules/app/modules/http/domain/instance"
import { AxiosError, InternalAxiosRequestConfig } from "axios"

interface ContractFixture {
  status: number
  body: Record<string, unknown>
}

const FIXTURES = import.meta.glob<ContractFixture>("../../../../contract/fixtures/*.json", {
  eager: true,
  import: "default",
})

function fixture(name: string): ContractFixture {
  const found = FIXTURES[`../../../../contract/fixtures/${name}.json`]

  if (!found) {
    throw new Error(`Unknown contract fixture: ${name}`)
  }

  return found
}

// Answers the next request with a body the server really sends, so the test goes
// through the real interceptor, the real normalisation and the real resolver.
export function serveFixture(name: string): void {
  const { status, body } = fixture(name)

  instance.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    throw new AxiosError(
      `Request failed with status code ${status}`,
      AxiosError.ERR_BAD_RESPONSE,
      config,
      null,
      {
        data: { time: "2026-11-05T14:52:51.428Z", ...body },
        status,
        statusText: "",
        headers: {},
        config,
      },
    )
  }
}

// The server never answered: no response, no body, no code.
export function serveNetworkFailure(): void {
  instance.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    throw new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, null, undefined)
  }
}
