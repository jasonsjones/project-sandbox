// import { Stream } from 'stream';
import fs, { createWriteStream } from 'fs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import Avatar from './avatar.entity';

@Resolver(() => Avatar)
export class AvatarResolver {
    @Mutation(() => Boolean)
    async avatarUpload(
        @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload
    ): Promise<boolean> {
        const fileDir = process.env.NODE_ENV !== 'test' ? 'uploads' : 'testUploads';
        const filePath = `${__dirname}/../../../${fileDir}`;
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }

        return new Promise((resolve, reject) => {
            image
                .createReadStream()
                .pipe(createWriteStream(`${filePath}/${image.filename}`))
                .on('finish', () => resolve(true))
                .on('error', () => reject(false));
        });
    }
}
