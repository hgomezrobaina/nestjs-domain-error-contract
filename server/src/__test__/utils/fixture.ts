import { readFileSync } from "node:fs"
import path from "node:path"

export interface ContractFixture {
  status: number
  body: Record<string, unknown>
}

const FIXTURES = path.resolve(__dirname, "../../../../contract/fixtures")

export function fixture(name: string): ContractFixture {
  return JSON.parse(readFileSync(path.join(FIXTURES, `${name}.json`), "utf8"))
}

// "time" is the only field that changes between two identical failures.
export function withoutTime(body: Record<string, unknown>): Record<string, unknown> {
  const { time, ...rest } = body

  return rest
}
