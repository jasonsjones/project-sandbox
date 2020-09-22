import Express from 'express';
import getApp from '../config/app';
import { makeGraphQLCall } from '../testutils';

let app: Express.Application;

beforeAll(async () => {
    app = await getApp();
});

describe('query to verify server status', () => {
    it('it works', () => {
        const query = `query { status }`;

        return makeGraphQLCall(app, query).then((res) => {
            expect(res.body.data).toHaveProperty('status');
            expect(res.body.data.status).toEqual('Graphql api is working');
        });
    });
});
