export class Shipment {
  constructor(
    readonly id: string,
    readonly weight: number,
    readonly destination: string,
    private _dispatchedAt: Date | null,
  ) {}

  get dispatchedAt(): Date | null {
    return this._dispatchedAt;
  }

  dispatch(at: Date): void {
    this._dispatchedAt = at;
  }
}
