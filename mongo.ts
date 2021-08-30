import { MongoClient } from "./deps.ts";

const client = new MongoClient();
const uri =
  "mongodb+srv://deno_survey:ip9nitWgzPw5Vz6O@denosurvey.b9tli.mongodb.net/myFirstDatabase?authMechanism=SCRAM-SHA-1&retryWrites=true&w=majority";

//Connecting to a Local Database, id: deno_survey pass: ip9nitWgzPw5Vz6O
await client.connect(uri);

const db = client.database("deno_survey");

// Defining schema interface
interface UserSchema {
  id: string;
  name: string;
  email: string;
  password: string;
  save(): void;
}

interface SurveySchema {
  id: string;
  userId: string;
  name: string;
  description: string;
}


export const usersCollection = db.collection<UserSchema>("users");
export const surveyCollection = db.collection<SurveySchema>("survey");
