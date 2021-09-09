// deno-lint-ignore-file
import { usersCollection } from "../database/mongoDB/mongo.ts"
import { users } from "../database/fileTS/users.ts";
import { IUserService } from "./Contract/IUserService.ts";
import User from "../models/User.ts";

export class UserService implements IUserService {
  constructor() {
  }

  async createUser(user: User, db: string): Promise<User> {
    let _id: any;
    switch (db) {
      case "mongo":
        _id = await usersCollection.insertOne(user);
        user.id = String(_id);
        await usersCollection.updateOne({ email: user.email }, {
          $set: { id: user.id },
        }).catch((err) => err.message);
        break;
      case "local":
        user.id = String(new Date().getTime());
        users.push(user);
        break;
      default:
    }
    return user;
  }

  updateUser(): void {
    throw new Error("Method not implemented.");
  }

  deleteUser(): void {
    throw new Error("Method not implemented.");
  }

  async findUserById(id: string, db: string): Promise<any> {
    let myDocument: any;
    switch (db) {
      case "mongo":
        myDocument = await usersCollection.find({ id: id }, {
          noCursorTimeout: false,
        }).toArray();
        myDocument = myDocument[0];
        break;
      case "local":
        myDocument = users.find((user) => user.id === id);
        break;
      default:
        console.log("Error, no database found!");
    }
    return myDocument;
  }

  findAllUsers(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async findUserByEmail(email: string, db: string): Promise<any> {
    let myDocument: any;
    switch (db) {
      case "mongo":
        myDocument = await usersCollection.find({ email: email }, {
          noCursorTimeout: false,
        }).toArray();
        myDocument = myDocument[0];
        break;
      case "local":
        myDocument = users.find((user) => user.email === email);
        break;
      default:
        console.log("Error, no database found!");
    }
    return myDocument;
  }
}
