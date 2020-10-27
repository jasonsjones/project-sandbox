import fs from 'fs';
import request from 'supertest';
import { Application } from 'express';
import createApp from '../config/app';
import { makeGraphQLFileUpload } from '../testutils';

const testFile = `${__dirname}/../testutils/images/default_avatar.png`;
const testUploadDir = `${__dirname}/../../testUploads`;

let app: Application;
beforeAll(async () => {
    app = await createApp();
});

afterAll(() => {
    fs.rmdirSync(testUploadDir, { recursive: true });
});

describe('Avatar resolver', () => {
    describe('upload avatar mutation', () => {
        it('uploads png image', () => {
            return makeGraphQLFileUpload(app, testFile, 'image').then(({ body }) => {
                expect(body.data.avatarUpload).toBe(true);
            });
        });
    });
});
