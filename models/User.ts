import { usersCollection } from "../mongo.ts";

export default class User {
  public id = "";
  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  static async findOne(params: any) {
    const myDocument = await usersCollection.find(params, {
      noCursorTimeout: false,
    }).toArray();
    return myDocument[0];
  }

  async save() {
    const id = await usersCollection.insertOne(this);
    this.id = String(id);
    await usersCollection.updateOne({ email: this.email }, {
      $set: { id: this.id },
    }).catch((err) => err.message);
    return this;
  }
}
