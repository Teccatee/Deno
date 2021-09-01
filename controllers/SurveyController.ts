import { RouterContext } from "../deps.ts";
import Survey from "../models/Survey.ts";
import User from "../models/User.ts";

class SurveyController {
  async getAllForUser(ctx: RouterContext) {
    const user = ctx.state.user as User;
    const surveys = await Survey.findByUserId(user.id);
    ctx.response.body = surveys;
  }

  async getSingle(ctx: RouterContext) {
    const id: string = ctx.params.id!;
    const survey = await Survey.findBySurveyId(id);
    if (!survey) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Incorrect survey ID" };
      return;
    }
    ctx.response.status = 201;
    ctx.response.body = survey;
    return;
  }

  async create(ctx: RouterContext) {
    const result = ctx.request.body(); // content type automatically detected
    if (result.type === "json") {
      const value = await result.value; // an object of parsed JSON
      const { name, description } = value;
      const user = ctx.state.user as User;
      const survey = new Survey(user.id, name, description);
      await survey.create();
      ctx.response.status = 201;
      ctx.response.body = {
        id: survey.id,
        userId: survey.userId,
        name: survey.name,
        description: survey.description,
      };
    } else {
      ctx.response.status = 423;
      ctx.response.body = {
        message: "Error, type of document is not a JSON/BSON",
      };
    }
  }
  async update(ctx: RouterContext) {
    const id = ctx.params.id!;
    const _survey = await Survey.findBySurveyId(id);
    if (!_survey) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Incorrect ID" };
      return;
    }
    const survey = new Survey(
      _survey.userId,
      _survey.name,
      _survey.description,
    );
    survey.id = _survey.id;
    const result = ctx.request.body(); // content type automatically detected
    if (result.type === "json") {
      const value = await result.value; // an object of parsed JSON
      const { name, description } = value;
      if (!name && !description) {
        ctx.response.status = 422;
        ctx.response.body = {
          message: "Please provide correct field that you want to modify",
        };
        return;
      }
      await survey.update({ name, description });
      ctx.response.status = 201;
      ctx.response.body = {
        id: survey.id,
        userId: survey.userId,
        name: survey.name,
        description: survey.description,
      };
    } else {
      ctx.response.status = 423;
      ctx.response.body = {
        message: "Error, type of document is not a JSON/BSON",
      };
    }
  }
  
  async delete(ctx: RouterContext) {
    const id = ctx.params.id!;
    let _survey = await Survey.findBySurveyId(id);
    if (!_survey) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Incorrect survey ID" };
      return;
    }
    const survey = new Survey(
      _survey.userId,
      _survey.name,
      _survey.description,
    );
    survey.id = _survey.id;
    survey.delete();
    _survey = await Survey.findBySurveyId(survey.id);
    if (!_survey) {
      ctx.response.status = 201;
      ctx.response.body = { message: "Survey deleted!" };
      return;
    }
  }
}

const surveyController = new SurveyController();
export default surveyController;
