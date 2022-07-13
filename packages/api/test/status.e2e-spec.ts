import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import constants from '../src/status/constants';
import { StatusModule } from '../src/status/status.module';
import { json } from 'express';
import { GraphQLModule } from '@nestjs/graphql';
import { statusQuery } from './utils/constants';

describe('Status resolver (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                GraphQLModule.forRoot<ApolloDriverConfig>({
                    autoSchemaFile: 'src/schema.gql',
                    cors: {
                        origin: ['http://localhost:4200'],
                        credentials: true
                    },
                    context: ({ req, res }) => ({ req, res }),
                    driver: ApolloDriver
                }),
                StatusModule
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(json());
        await app.init();
    });

    it('Query status', () => {
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
