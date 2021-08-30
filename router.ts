import { Router } from "./deps.ts";
import authController from "./controllers/AuthController.ts";
import surveyController from "./controllers/SurveyController.ts";
import { authMiddleware } from "./middlewares/authMiddlewares.ts";
import siteController from "./controllers/SiteController.ts";

const router = new Router();

router
  .get("/", siteController.surveys)
  .get("/survey/:id", siteController.viewSurvey)
  // Login and Registration
  .post("/api/login", authController.login)
  .post("/api/register", authController.register)
  // For survey
  .get('/api/survey', authMiddleware, surveyController.getAllForUser)
  .get('/api/survey/:id', authMiddleware, surveyController.getSingle)
  .post('/api/survey', authMiddleware, surveyController.create)
  .put('/api/survey/:id', authMiddleware, surveyController.update)
  .delete('/api/survey/:id', authMiddleware, surveyController.delete);

export default router;
