import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AvatarModule } from '../src/avatar/avatar.module';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { avatarUploadOp } from './utils/constants';

function generateVariableMap(keyName: string) {
    return {
        [keyName]: [`variables.${keyName}`]
    };
}

const constants = {
    OPERATIONS: 'operations',
    MAP: 'map'
};

describe('Avatar resolver (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                GraphQLModule.forRoot({
                    autoSchemaFile: 'src/schema.gql',
                    cors: {
                        origin: ['http://localhost:4200'],
                        credentials: true
                    },
                    context: ({ req, res }) => ({ req, res })
                }),
                AvatarModule
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(graphqlUploadExpress());
        await app.init();
    });

    describe('upload avatar mutation', () => {
        it('uploads png image', () => {
            const testFile = `${__dirname}/../avatars/default/avatar.png`;

            const variables = {
                image: null
            };

            const variableMap = generateVariableMap('image');

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'multipart/form-data')
                .field(constants.OPERATIONS, JSON.stringify({ query: avatarUploadOp, variables }))
                .field(constants.MAP, JSON.stringify(variableMap))
                .attach(Object.keys(variableMap)[0], testFile)
                .expect((res) => {
                    expect(res.body.data.avatarUpload).toBe(true);
                });
        });
    });
});
