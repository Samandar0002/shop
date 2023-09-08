export class User {
  constructor(public firstName: string, public password: string) {}

  getName(): string {
    return this.firstName;
  }
}
