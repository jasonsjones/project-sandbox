import { Test } from '@nestjs/testing';
import { Request, Response } from 'express';
import fs from 'fs';
import { FileUpload } from 'graphql-upload';
import { AvatarResolver } from '../avatar.resolver';

function getTestImage(path: string): Promise<FileUpload> {
    const stream = fs.createReadStream(`${__dirname}/../../../avatars/${path}`);
    const file: FileUpload = {
        createReadStream: () => stream,
        filename: 'test-image.png',
        mimetype: 'image/png',
        encoding: 'buffer'
    };
    return Promise.resolve(file);
}

describe('Avatar resolver', () => {
    const userId = '05fc4d47-b88c-4494-86e9-b64d748e1df6';
    let avatarResolver: AvatarResolver;
    let req: Request;
    let res: Response;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [AvatarResolver]
        }).compile();
        avatarResolver = moduleRef.get<AvatarResolver>(AvatarResolver);
        req = {
            user: {
                id: userId
            }
        } as Request;
        res = {} as Response;
    });

    describe('upload mutation', () => {
        it('uploads an image to the image store', async () => {
            const image = getTestImage('default/avatar.png');
            const result = await avatarResolver.avatarUpload({ userId, image }, { req, res });
            expect(result).toBe(true);
        });

        it('does NOT upload a file if the userId and the context user id do not match', async () => {
            const unknownId = userId.replace('e', 'd');
            const image = getTestImage('default/avatar.png');
            const result = await avatarResolver.avatarUpload(
                { userId: unknownId, image },
                { req, res }
            );
            expect(result).toBe(false);
        });

        it('replaces initial image with second image upload', async () => {
            const firstImage = getTestImage('default/avatar.png');
            await avatarResolver.avatarUpload({ userId, image: firstImage }, { req, res });
            const firstImageData = avatarResolver.avatar(userId).split(' ')[1].substring(0, 100);
            const secondImage = getTestImage('test/trailhead.png');
            await avatarResolver.avatarUpload({ userId, image: secondImage }, { req, res });
            const secondImageData = avatarResolver.avatar(userId).split(' ')[1].substring(0, 100);

            expect(secondImageData).not.toEqual(firstImageData);
        });
    });

    describe('avatar query', () => {
        it('returns the dataUrl representation of an avatar for user', async () => {
            const image = getTestImage('default/avatar.png');
            await avatarResolver.avatarUpload({ userId, image }, { req, res });
            const result = avatarResolver.avatar(userId);
            expect(result.split(' ')[0]).toEqual('data:image/png;base64,');
        });
    });
});
