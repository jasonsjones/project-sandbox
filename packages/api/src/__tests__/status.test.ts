import { Application } from 'express';
import createApp from '../config/app';
import { makeGraphQLCall } from '../testutils';

let app: Application;

beforeAll(async () => {
    app = await createApp();
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
