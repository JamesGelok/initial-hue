import * as express from 'express';
import { Application } from 'express';
import * as cors from 'cors';
import { CONFIG } from './config';
import { Routes } from './routes';


export class SimpleServer {

    public initialize(): Promise<void> {
        const app: Application = express();

        app.use(cors());

        this.setupRoutes(app);

        return this.launchServer(app, CONFIG.HOST, CONFIG.PORT);
    }

    private setupRoutes(app: Application): Routes {
        return new Routes(app);
    }

    private launchServer(app: Application, host: string, port: string): Promise<void> {
        console.log('APP:: starting up server...');

        return new Promise<void>(resolve => {
            app.listen(port, () => {
                console.log('APP:: listening at http://' + host + ':' + port);
                resolve();
            });
        });
    }

}
