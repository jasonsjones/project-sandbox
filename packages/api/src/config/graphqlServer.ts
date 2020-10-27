import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import StatusResolver from '../modules/status/StatusResolver';
import StatusService from '../modules/status/StatusService';
import UserResolver from '../modules/user/UserResolver';
import UserService from '../modules/user/UserService';
import AvatarResolver from '../modules/avatar/AvatarResolver';

export async function createGraphqlServer(): Promise<ApolloServer> {
    const schema = await buildSchema({ resolvers: [StatusResolver, UserResolver, AvatarResolver] });
    const statusService = new StatusService();
    const userService = new UserService();

    const server = new ApolloServer({
        schema,
        dataSources: () => {
            return { statusService, userService };
        }
    });
    return server;
}
