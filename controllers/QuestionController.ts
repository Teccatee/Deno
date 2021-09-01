import { RouterContext } from "../deps.ts";
import Question from "../models/Question.ts";
import Survey from "../models/Survey.ts";

class QuestionController {
  async getBySurvey(ctx: RouterContext) {
    const surveyId: string = ctx.params.surveyId!;
    const questions = await Question.findBySurveyId(surveyId);
    if (!questions) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Incorrect ID" };
      return;
    }
    ctx.response.status = 201;
    ctx.response.body = questions;
    return;
  }

  async getSingle(ctx: RouterContext) {
    const id: string = ctx.params.id!;
    const question = await Question.findByQuestionId(id);
    if (!question) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Incorrect survey ID" };
      return;
    }
    ctx.response.status = 201;
    ctx.response.body = question;
    return;
  }

  async create(ctx: RouterContext) {
    const surveyId: string = ctx.params.surveyId!;
    const result = ctx.request.body(); // content type automatically detected
    if (result.type === "json") {
      const value = await result.value; // an object of parsed JSON
      const { text, type, required, data } = value;
      const survey = await Survey.findBySurveyId(surveyId);
      if (!survey) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Incorrect survey ID" };
        return;
      }
      const question = new Question(surveyId, text, type, required, data);
      await question.create();
      ctx.response.status = 201;
      ctx.response.body = question;
    } else {
      ctx.response.status = 423;
      ctx.response.body = {
        message: "Error, type of document is not a JSON/BSON",
      };
    }
  }

  async update(ctx: RouterContext) {
    const id = ctx.params.id!;
    const _question = await Question.findByQuestionId(id);
    if (!_question) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Incorrect question ID" };
      return;
    }
    const question = new Question(
      _question.surveyId,
      _question.text,
      _question.type,
      _question.required,
      _question.data,
    );
    question.id = _question.id;
    const result = ctx.request.body(); // content type automatically detected
    if (result.type === "json") {
      const value = await result.value; // an object of parsed JSON
      const { text, type, required, data } = value;
      if (!text && !type && !required && !data) {
        ctx.response.status = 422;
        ctx.response.body = {
          message: "Please provide correct field that you want to modify",
        };
        return;
      }
      await question.update(text, type, required, data);
      ctx.response.status = 201;
      ctx.response.body = question;
    } else {
      ctx.response.status = 423;
      ctx.response.body = {
        message: "Error, type of document is not a JSON/BSON",
      };
    }
  }

  async delete(ctx: RouterContext) {
    const id = ctx.params.id!;
    let _question = await Question.findByQuestionId(id);
    if (!_question) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Incorrect question ID" };
      return;
    }
    const question = new Question(
      _question.surveyId,
      _question.text,
      _question.type,
      _question.required,
      _question.data,
    );
    question.id = _question.id;
    question.delete();
    _question = await Question.findByQuestionId(question.id);
    if (!_question) {
      ctx.response.status = 201;
      ctx.response.body = { message: "Survey deleted!" };
      return;
    }
  }
}

const questionController = new QuestionController();
export default questionController;
