export class Carrier {
  constructor(
    readonly id: string,
    readonly maxWeight: number,
    private readonly countries: string[],
  ) {}

  covers(country: string): boolean {
    return this.countries.includes(country)
  }
}
