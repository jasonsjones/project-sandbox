import express, { Application, NextFunction, Request, Response } from 'express';
import { createGraphqlServer } from './graphqlServer';

const clientUrls = ['http://localhost:4200'];

function cors(_: Request, res: Response, next: NextFunction): void {
    res.append('Access-Control-Allow-Origin', clientUrls);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

function logger(req: Request, _: Response, next: NextFunction): void {
    const hasBody = Object.keys(req.body).length !== 0;
    const methodAndPath = `${req.method}  ${req.path}`;

    let payload = '';
    if (hasBody && req.body.operationName === 'IntrospectionQuery') {
        payload = 'graphql playground query';
    } else if (hasBody) {
        payload = JSON.stringify(req.body);
    }

    console.log(`${methodAndPath} - ${payload}`);
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

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors);
    app.use(logger);

    app.get('/api', handleRootAPIRoute);

    server.applyMiddleware({ app });

    return app;
}

export default createApp;
