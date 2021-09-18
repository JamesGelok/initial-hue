import { DB_CONFIG } from './config';
import { Collection, Db, MongoClient } from 'mongodb';
import { User } from './models';


class DatabaseServer {

    private static readonly URL: string = 'mongodb://' + DB_CONFIG.HOST + ':' + DB_CONFIG.PORT + '/' + DB_CONFIG.DATABASE_NAME;

    constructor(private collectionName: string) {
    }

    public async initialize(): Promise<Collection> {
        const client = await this.connectToServer();
        const db = this.connectToDatabase(client, DB_CONFIG.DATABASE_NAME);
        const collection = await this.createCollection(db, this.collectionName);

        console.log('DB:: initialize complete. Yeah!!');
        return collection;
    }

    private async connectToServer(): Promise<MongoClient> {
        console.log('DB:: Connecting to mongoDB server...');
        const client = MongoClient.connect(DatabaseServer.URL);

        console.log('DB: Connecting to mongoDB server successful.');
        return client;
    }

    private connectToDatabase(client: MongoClient, dbPath: string): Db {
        console.log(`DB:: Connecting to database "${dbPath}"...`);
        const db = client.db(dbPath);

        console.log(`DB:: Connecting to database "${dbPath}" successful.`);
        return db;
    }

    private async createCollection(db: Db, collectionName: string): Promise<Collection> {
        console.log(`DB:: Creating collection "${collectionName}"...`);
        const collection = await db.createCollection(collectionName);

        console.log(`DB:: Creating collection "${collectionName}" successful`);
        return db.collection(collectionName);
    }
}


class DatabaseWrapper {

    private databases = [
        'users',
    ] as const;

    private collections: Record<string, Collection> = {};

    public get users(): Collection<User> {
        console.assert(this.collections.users, 'DB:: "users" collection must be initialized first.');
        return this.collections.users;
    }

    public async initialize(): Promise<void> {
        for (const dbName of this.databases) {
            this.collections[dbName] = await new DatabaseServer(dbName).initialize();
        }
    }
}

export const DB = new DatabaseWrapper();
