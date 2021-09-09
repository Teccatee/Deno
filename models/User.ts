import { UserService } from "../services/UserService.ts";

export default class User {
  public id = "";
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  // static async findOne(params: any) {
  //   const myDocument = await usersCollection.find(params, {
  //     noCursorTimeout: false,
  //   }).toArray();
  //   return myDocument[0];
  // }

  static async findUserByEmail(email: string): Promise<User> {
    const userService = new UserService();
    const myDocument = await userService.findUserByEmail(email, 'mongo');
    return myDocument;
  }

  async createUser(): Promise<User> {
    const userService = new UserService();
    let user = new User(this.name, this.email, this.password);
    user.id = this.id;
    user = await userService.createUser(user, 'mongo');
    return user;
  }
}
