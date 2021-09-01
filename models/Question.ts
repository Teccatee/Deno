import { questionCollection } from "../mongo.ts";

export default class Question {
  public id: string = "";

  constructor(
    public surveyId: string,
    public text: string,
    public type: QuestionType,
    public required: boolean,
    public data: any,
  ) {}

  static async findBySurveyId(surveyId: string) {
    return await questionCollection.find({ surveyId }, {
      noCursorTimeout: false,
    }).toArray();
  }

  static async findByQuestionId(id: string) {
    const myQuestion = await questionCollection.find({ id: id }, {
      noCursorTimeout: false,
    }).toArray();
    return myQuestion[0];
  }

  async create() {
    const id = await questionCollection.insertOne(this);
    this.id = String(id);
    await questionCollection.updateOne({ _id: id }, { $set: { id: this.id } })
      .catch((err) => err.message);
    return this;
  }

  async update(text: string, type: QuestionType, required: boolean, data: any) {
    await questionCollection.updateOne({ id: this.id }, {
      $set: {
        text: text,
        type: type,
        required: required,
        data: data,
      },
    }).catch((err) => err.message);
    this.text = text;
    this.type = type;
    this.required = required;
    this.data = data;
    return this;
  }

  async delete() {
    await questionCollection.deleteOne({ id: this.id });
  }

  isText(): boolean {
    return this.type === QuestionType.TEXT;
  }

  isChoice(): boolean {
    return this.type === QuestionType.CHOICE;
  }

}

export enum QuestionType {
  CHOICE = "choice",
  TEXT = "text",
}