import Survey from "../../models/Survey.ts";

export interface ISurveyService {

  findAllSurveys(db: string): void;
  findSurveysByUserId(id: string, db: string): void;
  findSurveyById(surveyId: string, db: string): void;
  createSurvey(survey: Survey, db: string): void;
  updateSurvey(survey: Survey, db: string): void;
  deleteSurvey(id: string, db: string): void;
  
}
