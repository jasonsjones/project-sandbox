import express, { Request, Response } from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

function configureApp() {
    const app = express();
    const typeDefs = gql`
        type Query {
            status: String
        }
    `;

    const resolvers = {
        Query: {
            status: () => 'Graphql api is working'
        }
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    app.get(
        '/api',
        (_: Request, res: Response): Response => {
            return res.json({
                success: true,
                message: 'side project api'
            });
        }
    );

    server.applyMiddleware({ app });

    return app;
}

export default configureApp();
