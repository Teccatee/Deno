import { surveyCollection } from "../database/mongoDB/mongo.ts";
import { SurveyService } from "../services/SurveyService.ts";

export default class Survey {
  private _id = "";

  constructor(
    private _userId: string,
    private _name: string,
    private _description: string,
  ) {}

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(userId: string) {
    this._userId = userId;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }

  static async findAllSurveys(): Promise<Survey[]> {
    const surveyService = new SurveyService();
    const surveys = await surveyService.findAllSurveys('mongo');
    return surveys;
  }

  static async findAll() {
    return await surveyCollection.find({}, { noCursorTimeout: false })
      .toArray();
  }

  // static async findByUserId(userId: string) {
  //   return await surveyCollection.find({ userId }, { noCursorTimeout: false })
  //     .toArray();
  // }

  static async findByUserId(userId: string): Promise<Survey[]> {
    const surveyService = new SurveyService();
    const surveys = await surveyService.findSurveysByUserId(userId, 'mongo');
    return surveys;
  }

  // static async findByUser(userId: string): Promise<Survey[]> {
  //     const surveys = await surveyCollection.find({ userId });
  //     return surveys.map((survey: any) => Survey.prepare(surveys));
  // }

  static async findBySurveyId(id: string): Promise<Survey> {
    const surveyService = new SurveyService();
    const survey = await surveyService.findSurveyById(id, 'mongo');
    return survey;
  }

  // static async findBySurveyId(id: string) {
  //   const mySurvey = await surveyCollection.find({ id: id }, {
  //     noCursorTimeout: false,
  //   }).toArray();
  //   return mySurvey[0];
  // }

  async create() {
    const id = await surveyCollection.insertOne(this);
    this.id = String(id);
    await surveyCollection.updateOne({ _id: id }, { $set: { id: this.id } })
      .catch((err) => err.message);
    return this;
  }

  async update({ name, description }: { name: string; description: string }) {
    await surveyCollection.updateOne({ id: this.id }, {
      $set: { name, description },
    }).catch((err) => err.message);
    this.name = name;
    this.description = description;
    return this;
  }

  async delete() {
    await surveyCollection.deleteOne({ id: this.id });
  }

  // private static prepare(data: any): Survey {
  //     data.id = data._id;
  //     delete data._id;
  //     const survey = new Survey(data.userId, data.name, data.description);
  //     survey.id = data.id;
  //     return survey;
  // }
}
