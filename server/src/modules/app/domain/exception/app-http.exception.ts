import { HttpStatus } from "@nestjs/common";

export type AppHttpErrorParam = {
  name: string;
  value: string;
};

export abstract class AppHttpException extends Error {
  abstract status(): HttpStatus;
  abstract code(): string;
  abstract content(): string;

  params(): AppHttpErrorParam[] {
    return [];
  }

  response() {
    return {
      message: this.content(),
      status: this.status(),
      code: this.code(),
      params: this.params(),
    };
  }
}
