import { Writable } from 'stream';
import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import Avatar from './avatar.entity';

@Resolver(() => Avatar)
export class AvatarResolver {
    private readonly logger = new Logger(AvatarResolver.name);

    // stub top-level query to make avatar e2e tests happy
    @Query((_returns) => String)
    avatar(): string {
        return 'temp avatar status message';
    }

    @Mutation(() => Boolean)
    async avatarUpload(
        @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload
    ): Promise<boolean> {
        // For time being, do nothing with the data 'chunk'.
        // Eventually, this function will be replaced with the cloudinary upload_stream API
        const nullStream = new Writable({
            write(_chunk, _encoding, cb) {
                cb();
            }
        });

        this.logger.log('Uploading avatar');
        return new Promise((resolve, reject) => {
            image
                .createReadStream()
                .pipe(nullStream)
                .on('finish', () => resolve(true))
                .on('error', () => reject(false));
        });
    }
}
