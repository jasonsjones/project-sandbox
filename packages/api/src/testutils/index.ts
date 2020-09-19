import request from 'supertest';
import Express from 'express';

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
