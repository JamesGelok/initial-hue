import { ObjectID } from 'bson';

abstract class DatabaseModel {
    constructor(
        public _id?: ObjectID
    ) {
    }
}

export class User extends DatabaseModel {
    constructor(
        public email: string,
        public password: string,
        _id?: ObjectID,
    ) {
        super(_id);
    }

    public static fromRequestBody(body: any): User {
        return new User(
            (body.email || '').toString(),
            (body.password || '').toString(),
            new ObjectID(body._id),
        );
    }

    public static fromRequestBodyPartial(body: any): Partial<User> {
        const result: Partial<User> = {};

        if(body.email !== undefined) {
            result.email = (body.email || '').toString();
        }

        if(body.password !== undefined) {
            result.password = (body.password || '').toString();
        }

        if(body._id !== undefined) {
            result._id = new ObjectID(body._id);
        }

        return result;
    }
}
