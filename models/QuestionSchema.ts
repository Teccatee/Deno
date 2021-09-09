import { QuestionType } from "./Question.ts";

export interface QuestionSchema {
  id: string;
  surveyId: string,
  text: string;
  type: QuestionType;
  required: boolean;
  data: any;
}