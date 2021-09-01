import { Router } from "./deps.ts";
import authController from "./controllers/AuthController.ts";
import surveyController from "./controllers/SurveyController.ts";
import { authMiddleware } from "./middlewares/authMiddlewares.ts";
import siteController from "./controllers/SiteController.ts";
import questionController from "./controllers/QuestionController.ts";

const router = new Router();

router
  .get("/", siteController.surveys)
  .get("/survey/:id", siteController.viewSurvey)
  .post("/survey/:id", siteController.submitSurvey)
  // Login and Registration
  .post("/api/login", authController.login)
  .post("/api/register", authController.register)
  // For survey
  .get('/api/survey', authMiddleware, surveyController.getAllForUser)
  .get('/api/survey/:id', authMiddleware, surveyController.getSingle)
  .post('/api/survey', authMiddleware, surveyController.create)
  .put('/api/survey/:id', authMiddleware, surveyController.update)
  .delete('/api/survey/:id', authMiddleware, surveyController.delete)
  // For question
  .get('/api/survey/:surveyId/questions', authMiddleware, questionController.getBySurvey)
  .get('/api/question/:id', authMiddleware, questionController.getSingle)
  .post('/api/question/:surveyId', authMiddleware, questionController.create)
  .put('/api/question/:id', authMiddleware, questionController.update)
  .delete('/api/question/:id', authMiddleware, questionController.delete);

export default router;
