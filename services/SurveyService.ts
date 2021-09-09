// deno-lint-ignore-file
import Survey from "../models/Survey.ts";
import { surveyCollection } from "../mongo.ts";
import { ISurveyService } from "./Contract/ISurveyService.ts";
import { surveys } from "../database/fileTS/survey.ts";

export class SurveyService implements ISurveyService {
  constructor() {
  }

  async findAllSurveys(db: string): Promise<Survey[]> {
    let surveys: any;
    switch (db) {
      case "mongo":
        surveys = await surveyCollection.find({}, { noCursorTimeout: false })
          .toArray();
        break;
      case "local":
        break;
      default:
        console.log("Error, no database found!");
    }
    return surveys;
  }

  async findSurveysByUserId(userId: string, db: string): Promise<Survey[]> {
    let mySurveys: any;
    switch (db) {
      case "mongo":
        mySurveys = await surveyCollection.find({ userId: userId }, {
          noCursorTimeout: false,
        })
          .toArray();
        break;
      case "local":
        mySurveys = surveys.filter((survey) => survey.userId === userId);
        break;
      default:
        console.log("Error, no database found!");
    }
    return mySurveys;
  }

  async findSurveyById(surveyId: string, db: string): Promise<Survey> {
    let mySurvey: any;
    switch (db) {
      case "mongo":
        mySurvey = await surveyCollection.find({ id: surveyId }, {
          noCursorTimeout: false,
        })
          .toArray();
        mySurvey = mySurvey[0];
        break;
      case "local":
        mySurvey = surveys.find((survey) => survey.id === surveyId);
        break;
      default:
        console.log("Error, no database found!");
    }
    return mySurvey;
  }

  createSurvey(survey: Survey, db: string): void {
    throw new Error("Method not implemented.");
  }

  updateSurvey(survey: Survey, db: string): void {
    throw new Error("Method not implemented.");
  }

  deleteSurvey(id: string, db: string): void {
    throw new Error("Method not implemented.");
  }
}
