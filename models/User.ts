import { usersCollection } from "../mongo.ts";

export default class User {
  public id: string;
  public name: string;
  public email: string;
  public password: string;

  constructor({ id = "", name = "", email = "", password = "" }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async findOne(params: any) {
    const myDocument = await usersCollection.find(params, { noCursorTimeout: false }).toArray();
    return myDocument[0];
  }

  async save() {
    const id = await usersCollection.insertOne(this);
    this.id = String(id);
    await usersCollection.updateOne({email: this.email}, { $set: {id: this.id}}).catch(err => err.message);
    return this;
  }
}
