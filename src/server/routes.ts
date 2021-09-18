import * as bodyParser from 'body-parser';
import { Request, Response } from 'express-serve-static-core';
import { Application } from 'express';
import { DB } from '../database/database';
import { FilterQuery, ObjectID, UpdateQuery, } from 'mongodb';
import { User } from '../database/models';

export class Routes {

    constructor(app: Application) {

        app.use(bodyParser.json());

        app.get('/getUser', this.getUser);
        app.post('/createUser', this.createUser);
        app.post('/updateUser', this.updateUser);

    }

    public async getUser(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}" with params =`, req.query);

        try {
            const query = new ObjectID(req.query['_id']);

            const foundUser = await DB.users.findOne<User>(query);

            if(foundUser) {
                res.send(foundUser);
            }
            else {
                res.status(404).send({ success: false, msg: 'User not found' });
            }
        }
        catch(e) {
            res.status(404).send({ success: false, msg: 'Wrong ID format' })
        }
    }

    public async createUser(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}"`);

        const { _id, ...newUser } = User.fromRequestBody(req.body);

        const result = await DB.users.insertOne(newUser);
        res.send(result.ops[0]);
    }

    public async updateUser(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}"`);

        const { _id, ...updatedUserData } = User.fromRequestBodyPartial(req.body);

        const update: UpdateQuery<User> = {
            $set: updatedUserData,
        };

        const query: FilterQuery<User> = {
            _id,
        };

        try {
            await DB.users.updateOne(query, update);
            res.send({ success: true });
        }
        catch (e) {
            res.status(404).send({ success: false, msg: 'User could not be updated' })
        }
    }

}
