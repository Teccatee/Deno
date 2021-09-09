import Survey from "../models/Survey.ts";
import { RouterContext } from "../deps.ts";
import { renderView } from "../helpers.ts";
import Question from "../models/Question.ts";
import { answersCollection } from "../database/mongoDB/mongo.ts";

class SiteController {
  async surveys(ctx: RouterContext) {
    const surveys = await Survey.findAll();
    ctx.response.body = await renderView(`surveys`, { surveys });
  }

  async viewSurvey(ctx: RouterContext) {
    const id: string = ctx.params.id!;
    const errors: any = {};
    const answers: any = {};
    const survey = await Survey.findBySurveyId(id);
    if (!survey) {
      ctx.response.body = await renderView(`notfound`);
      return;
    }
    const _questions = await Question.findBySurveyId(id);
    const questions: Question[] = [];
    for (let i = 0; i < _questions.length; i++) {
      questions[i] = new Question(
        _questions[i].surveyId,
        _questions[i].text,
        _questions[i].type,
        _questions[i].required,
        _questions[i].data,
      );
      questions[i].id = _questions[i].id;
    }
    ctx.response.body = await renderView(`survey`, {
      survey,
      questions,
      answers,
      errors,
    });
  }

  async submitSurvey(ctx: RouterContext) {
    const id: string = ctx.params.id!;
    const _survey = await Survey.findBySurveyId(id);
    const survey = new Survey(_survey.userId, _survey.name, _survey.description);
    survey.id = _survey.id;
    if (!survey) {
      ctx.response.body = await renderView(`notfound`);
      return;
    }
    const result = await ctx.request.body();
    const value = await result.value;
    const formData: URLSearchParams = value as URLSearchParams;
    const errors: any = {};
    const answers: any = {};
    const _questions = await Question.findBySurveyId(id);
    const questions: Question[] = [];
    for (let i = 0; i < _questions.length; i++) {
      questions[i] = new Question(
        _questions[i].surveyId,
        _questions[i].text,
        _questions[i].type,
        _questions[i].required,
        _questions[i].data,
      );
      questions[i].id = _questions[i].id;
    }

    for (const question of questions) {
      let value: string | string[] | null = formData.get(question.id);
      if (question.isChoice() && question.data.multiple) {
        value = formData.getAll(question.id);
      }
      if (question.required) {
        if (
          !value ||
          (question.isChoice() && question.data.multiple && !value.length)
        ) {
          errors[question.id] = "This field is required";
        }
      }
      answers[question.id] = value;
    }
    console.log(errors, answers);
    if (Object.keys(errors).length > 0) {
      ctx.response.body = await renderView(`survey`, {
        survey,
        questions,
        errors,
        answers,
      });
      return;
    }
    const _id = await answersCollection.insertOne({
      surveyId: id,
      date: new Date(),
      userAgent: ctx.request.headers.get("User-Agent"),
      answers,
    });
    const answerId = String(_id);
    ctx.response.body = await renderView("surveyFinish", {
      answerId: answerId
    });
  }
}

const siteController = new SiteController();
export default siteController;