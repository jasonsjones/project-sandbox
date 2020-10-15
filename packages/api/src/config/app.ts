import express, { Application, NextFunction, Request, Response } from 'express';
import chalk from 'chalk';
import { createGraphqlServer } from './graphqlServer';

const clientUrls = ['http://localhost:4200'];

function cors(_: Request, res: Response, next: NextFunction): void {
    res.append('Access-Control-Allow-Origin', clientUrls);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

function logger(req: Request, _: Response, next: NextFunction): void {
    if (process.env.NODE_ENV !== 'development') {
        return next();
    }
    const hasBody = Object.keys(req.body).length !== 0;
    const methodAndPath = `${chalk.green(req.method)}  ${chalk.white(req.path)}`;

    let query = '';
    let variables = '';
    if (hasBody && req.body.operationName === 'IntrospectionQuery') {
        query = 'graphql playground query';
    } else if (hasBody && Object.keys(req.body).includes('query')) {
        query = req.body.query;
        variables = req.body.variables;
        console.log(`${methodAndPath} - ${chalk.cyan.italic(query.trim())}
      ${chalk.magenta('variables')}: ${chalk.magenta(JSON.stringify(variables))}`);
    } else {
        console.log(`${methodAndPath}`);
    }

    return next();
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
