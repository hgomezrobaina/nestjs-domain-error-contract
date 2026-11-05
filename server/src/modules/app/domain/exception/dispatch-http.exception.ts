import { HttpStatus } from "@nestjs/common"

export type DispatchHttpErrorParam = {
  name: string
  value: string
}

export abstract class DispatchHttpException extends Error {
  abstract status(): HttpStatus
  abstract code(): string
  abstract content(): string

  params(): DispatchHttpErrorParam[] {
    return []
  }

  response() {
    return {
      message: this.content(),
      status: this.status(),
      code: this.code(),
      params: this.params(),
    }
  }
}
