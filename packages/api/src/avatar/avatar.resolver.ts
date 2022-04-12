import { Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { Writable, WritableOptions } from 'stream';
import { v4 } from 'uuid';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { Avatar } from './avatar.entity';
import { AvatarUploadInput } from './dto/avatar-upload.dto';

interface StreamData {
    streamId: string;
    imageData: {
        mimeType?: string;
        data: Buffer;
    };
}

interface GraphQLContext {
    req: Request;
    res: Response;
}

class ImageStore {
    private static instance: ImageStore;
    private memStore: Record<string, StreamData>;

    private constructor() {
        this.memStore = {};
    }

    writeChunk(streamId: string, key: string, buffer: Buffer) {
        if (this.isNewStreamOrDoesNotExist(streamId, key)) {
            this.memStore[key] = {
                streamId,
                imageData: {
                    data: buffer
                }
            };
        } else {
            this.get(key).imageData.data = Buffer.concat([this.get(key).imageData.data, buffer]);
        }
    }

    getImage(key: string) {
        return this.get(key)?.imageData;
    }

    setMimeType(key: string, type: string) {
        if (this.get(key)) {
            this.get(key).imageData.mimeType = type;
        }
    }

    private get(key: string) {
        return this.memStore[key] ?? null;
    }

    private isNewStreamOrDoesNotExist(streamId: string, key: string) {
        return !this.get(key) || this.get(key).streamId != streamId;
    }

    static getInstance(): ImageStore {
        if (!ImageStore.instance) {
            ImageStore.instance = new ImageStore();
        }

        return ImageStore.instance;
    }
}

class ImageStream extends Writable {
    store: ImageStore;
    id: string;
    key: string;

    constructor(key: string, options?: WritableOptions) {
        super(options);
        this.id = v4();
        this.key = key;
        this.store = ImageStore.getInstance();
    }

    _write(chunk: any, _enc: BufferEncoding, next: () => void) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, _enc);
        this.store.writeChunk(this.id, this.key, buffer);
        next();
    }

    getStore() {
        return this.store;
    }
}

@Resolver(() => Avatar)
export class AvatarResolver {
    private readonly logger = new Logger(AvatarResolver.name);
    private store = ImageStore.getInstance();

    @Query((_returns) => String, { nullable: true })
    avatar(@Args('key') key: string): string {
        this.logger.log('Fetching user avatar image from image store');

        const image = this.store.getImage(key);
        if (image?.data instanceof Buffer) {
            return `data:${image.mimeType};base64, ${image.data.toString('base64')}`;
        }
        return null;
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async avatarUpload(
        @Args('avatarData') avatarData: AvatarUploadInput,
        @Context() { req }: GraphQLContext
    ): Promise<boolean> {
        // To save to the local file system, replace `nullStream` with `writeStream`
        // const writeStream = fs.createWriteStream(path.join(__dirname, `../../../avatars/${image.filename}`))

        // const nullStream = new Writable({
        //     write(_chunk, _encoding, next) {
        //         next();
        //     }
        // });

        const { userId, image } = avatarData;

        if (userId != req.user.id) {
            return Promise.resolve(false);
        }

        const { createReadStream, mimetype } = await image;
        const stream = createReadStream();

        const imageStream = new ImageStream(userId)
            .on('finish', () => {
                imageStream.getStore().setMimeType(userId, mimetype);
                this.logger.log('Image stream received image...');
            })
            .on('error', (err) => {
                this.logger.error(err);
            });

        this.logger.log('Uploading avatar');
        return new Promise((resolve, reject) => {
            stream
                .pipe(imageStream)
                .on('finish', () => resolve(true))
                .on('error', () => reject(false));
        });
    }
}
