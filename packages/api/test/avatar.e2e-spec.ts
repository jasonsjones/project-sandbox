import fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

function generateVariableMap(keyName: string) {
    return {
        keyName: [`variables.${keyName}`]
    };
}

const constants = {
    OPERATIONS: 'operations',
    MAP: 'map'
};

const AvatarUploadOp = `
mutation AvatarUpload ($image: Upload!) {
    avatarUpload(image: $image)
}
`;

describe('Avatar resolver (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
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
                .field(constants.OPERATIONS, JSON.stringify({ query: AvatarUploadOp, variables }))
                .field(constants.MAP, JSON.stringify(variableMap))
                .attach(Object.keys(variableMap)[0], testFile)
                .expect((res) => {
                    expect(res.body.data.avatarUpload).toBe(true);
                });
        });
    });
});
