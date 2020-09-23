import express, { Application, Request, Response } from 'express';
import { createGraphqlServer } from './graphqlServer';

function handleRootAPIRoute(_: Request, res: Response): Response {
    return res.json({
        success: true,
        message: 'side project api'
    });
}

async function createApp(): Promise<Application> {
    const app = express();
    const server = await createGraphqlServer();

    app.get('/api', handleRootAPIRoute);

    server.applyMiddleware({ app });

    return app;
}

export default createApp;
