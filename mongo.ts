import { MongoClient } from "./deps.ts";
import { UserSchema } from "./models/UserSchema.ts";
import { QuestionSchema } from "./models/QuestionSchema.ts";
import { SurveySchema } from "./models/SurveySchema.ts";

const client = new MongoClient();
const uri =
  "mongodb+srv://deno_survey:ip9nitWgzPw5Vz6O@denosurvey.b9tli.mongodb.net/myFirstDatabase?authMechanism=SCRAM-SHA-1&retryWrites=true&w=majority";

//Connecting to a Local Database, id: deno_survey pass: ip9nitWgzPw5Vz6O
await client.connect(uri);

const db = client.database("deno_survey");

export const usersCollection = db.collection<UserSchema>("users");
export const surveyCollection = db.collection<SurveySchema>("survey");
export const questionCollection = db.collection<QuestionSchema>("question");
export const answersCollection = db.collection("answers");