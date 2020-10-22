import request from 'supertest';
import Express from 'express';
import { oliver, barry, dig, cisco } from './userData';
import { GetUserOp, RegisterUserOp, UserQuery } from './userQueries';

export const makeGraphQLCall = (
    app: Express.Application,
    query: string,
    variables = {}
): request.Test => {
    return request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query, variables });
};

export { oliver, dig, barry, cisco, GetUserOp, RegisterUserOp, UserQuery };
