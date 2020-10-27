import { Stream } from 'stream';
import fs, { createWriteStream } from 'fs';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import Avatar from './Avatar';

interface Upload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream;
}

@Resolver(() => Avatar)
class AvatarResolver {
    @Mutation(() => Boolean)
    async avatarUpload(@Arg('image', () => GraphQLUpload) image: Upload): Promise<boolean> {
        const fileDir = process.env.NODE_ENV !== 'testing' ? 'uploads' : 'testUploads';
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

export default AvatarResolver;
