import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import StatusResolver from '../modules/status/StatusResolver';
import StatusDataSource from '../modules/status/StatusDataSource';

function handleRootAPIRoute(_: Request, res: Response): Response {
    return res.json({
        success: true,
        message: 'side project api'
    });
}

async function getApp() {
    const app = express();
    const schema = await buildSchema({ resolvers: [StatusResolver] });

    const server = new ApolloServer({
        schema,
        dataSources: () => {
            return {
                statusDataSource: new StatusDataSource()
            };
        }
    });

    app.get('/api', handleRootAPIRoute);

    server.applyMiddleware({ app });

    return app;
}

export default getApp;
