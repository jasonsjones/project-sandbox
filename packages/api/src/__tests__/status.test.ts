import { Application } from 'express';
import createApp from '../config/app';
import { makeGraphQLCall } from '../testutils';
import { statusQuery } from '@orion/shared';

let app: Application;

beforeAll(async () => {
    app = await createApp();
});

describe('query to verify server status', () => {
    it('it works', () => {
        return makeGraphQLCall(app, statusQuery).then((res) => {
            expect(res.body.data).toHaveProperty('status');
            expect(res.body.data.status).toEqual('Graphql api is working');
        });
    });
});
