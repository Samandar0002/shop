import { User } from "../entities/user";

export class UserRepository {
  userList: User[] = [];

  create(firstName: string, password: string) {
    const user = new User(firstName, password);
    this.userList.push(user);
  }

  getUserList() {
    return this.userList;
  }
}
