import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import constants from '../src/modules/status/constants';

describe('Status resolver (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Query status', () => {
        const statusQuery = `query { status }`;
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({ query: statusQuery })
            .expect(({ body }) => {
                const { status } = body.data;
                expect(status).toEqual(constants.STATUS_MESSAGE);
            });
    });
});
