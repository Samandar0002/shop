export class Cart {
  constructor(
    public id: string,
    public title: string,
    public price: string,
    public amount: number = 1,
    public total: number = Number(price)
  ) {}
}
