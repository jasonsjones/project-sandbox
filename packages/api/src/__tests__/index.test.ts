import Express from 'express';
import request from 'supertest';
import getApp from '../config/app';

let app: Express.Application;

beforeAll(async () => {
    app = await getApp();
});

it('GET /api returns simple json payload', (): Promise<void> => {
    return request(app)
        .get('/api')
        .then((res): void => {
            const json = res.body;

            expect(res.status).toBe(200);
            expect(json).toMatchObject({
                success: true,
                message: expect.any(String)
            });
        });
});
