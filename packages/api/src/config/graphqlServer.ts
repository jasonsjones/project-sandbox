import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import StatusResolver from '../modules/status/StatusResolver';
import StatusDataSource from '../modules/status/StatusDataSource';

export async function createGraphqlServer(): Promise<ApolloServer> {
    const schema = await buildSchema({ resolvers: [StatusResolver] });
    const statusDataSource = new StatusDataSource();

    const server = new ApolloServer({
        schema,
        dataSources: () => {
            return { statusDataSource };
        }
    });
    return server;
}
