import express, { Application, NextFunction, Request, Response } from 'express';
import { createGraphqlServer } from './graphqlServer';

const clientUrls = ['http://localhost:4200'];

function cors(_: Request, res: Response, next: NextFunction): void {
    res.append('Access-Control-Allow-Origin', clientUrls);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

function handleRootAPIRoute(_: Request, res: Response): Response {
    return res.json({
        success: true,
        message: 'side project api'
    });
}

async function createApp(): Promise<Application> {
    const app = express();
    const server = await createGraphqlServer();

    app.use(cors);

    app.get('/api', handleRootAPIRoute);

    server.applyMiddleware({ app });

    return app;
}

export default createApp;
