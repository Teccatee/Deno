import { questionCollection } from "../database/mongoDB/mongo.ts";

export default class Question {
  private _id: string = "";

  constructor(
    private _surveyId: string,
    private _text: string,
    private _type: QuestionType,
    private _required: boolean,
    private _data: any,
  ) {}

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get surveyId(): string {
    return this._surveyId;
  }

  set surveyId(surveyId: string) {
    this._surveyId = surveyId;
  }

  get text(): string {
    return this._text;
  }

  set text(text: string) {
    this._text = text;
  }

  get type(): QuestionType {
    return this._type;
  }

  set type(type: QuestionType) {
    this._type = type;
  }

  get required(): boolean {
    return this._required;
  }

  set required(required: boolean) {
    this._required = required;
  }

  get data(): any {
    return this._data;
  }

  set data(data: any) {
    this._data = data;
  }

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
