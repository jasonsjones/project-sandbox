import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import StatusResolver from '../modules/status/StatusResolver';
import StatusService from '../modules/status/StatusService';

export async function createGraphqlServer(): Promise<ApolloServer> {
    const schema = await buildSchema({ resolvers: [StatusResolver] });
    const statusService = new StatusService();

    const server = new ApolloServer({
        schema,
        dataSources: () => {
            return { statusService };
        }
    });
    return server;
}
