import { surveyCollection } from "../mongo.ts";

export default class Survey {
    public id = '';
  
    constructor(
        public userId: string,
        public name: string,
        public description: string
    ) {}

    static async findAll() {

    }

    static async findByUserId(userId: string) {
        return await surveyCollection.find({userId}, { noCursorTimeout: false }).toArray();
    }

    // static async findByUser(userId: string): Promise<Survey[]> {
    //     const surveys = await surveyCollection.find({ userId });
    //     return surveys.map((survey: any) => Survey.prepare(surveys));
    // }

    static async findBySurveyId(id: string) {
        const mySurvey = await surveyCollection.find({ id: id }, { noCursorTimeout: false }).toArray();
        return mySurvey[0];
    }

    async create() {
        const id = await surveyCollection.insertOne(this);
        this.id = String(id);
        await surveyCollection.updateOne({_id: id}, { $set: {id: this.id}}).catch(err => err.message);
        return this;
    }

    async update({name, description} : {name: string, description: string}) {
        await surveyCollection.updateOne({ id: this.id}, { $set: { name, description }}).catch(err => err.message);
        this.name = name;
        this.description = description;
        return this;
    }

    async delete() {
        await surveyCollection.deleteOne({ id: this.id});
    }

    // private static prepare(data: any): Survey {
    //     data.id = data._id;
    //     delete data._id;
    //     const survey = new Survey(data.userId, data.name, data.description);
    //     survey.id = data.id;
    //     return survey;
    // }
}