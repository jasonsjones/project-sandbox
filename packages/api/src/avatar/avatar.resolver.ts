import { Writable, WritableOptions } from 'stream';
import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import Avatar from './avatar.entity';

interface ImageType {
    mimeType?: string;
    data: Buffer;
}

class ImageStore {
    private static instance: ImageStore;
    private memStore: Record<string, ImageType>;

    private constructor() {
        this.memStore = {};
    }

    writeChunk(key: string, buffer: Buffer) {
        if (!this.memStore[key]) {
            this.memStore[key] = {data: buffer};
        } else {
            this.memStore[key].data = Buffer.concat([this.memStore[key].data, buffer]);
        }
    }

    getImage(key: string) {
        return this.memStore[key];
    }

    setMimeType(key: string, type: string) {
        if (this.memStore[key]) {
            this.memStore[key].mimeType = type;
        }
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
    key: string;

    constructor(key: string, options?: WritableOptions) {
        super(options);
        this.key = key;
        this.store = ImageStore.getInstance();
    }

    _write(chunk: any, _enc: BufferEncoding, callback: any) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, _enc);
        this.store.writeChunk(this.key, buffer);
        callback();
    }

    getStore() {
        return this.store;
    }
}

@Resolver(() => Avatar)
export class AvatarResolver {
    private readonly logger = new Logger(AvatarResolver.name);
    private store = ImageStore.getInstance();

    // stub top-level query to make avatar e2e tests happy
    @Query((_returns) => String)
    avatar(@Args('key') key:string): string {
        const image = this.store.getImage(key);
        if (image?.data instanceof Buffer) {
            return `data:${image.mimeType};base64, ${image.data.toString('base64')}`;
        }
        return `Data for the key, '${key}', is not a Buffer`;
    }

    @Mutation(() => Boolean)
    async avatarUpload(
        @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload
    ): Promise<boolean> {
        // For time being, do nothing with the data 'chunk'.
        // Eventually, this function will be replaced with the cloudinary upload_stream API
        //
        // To save to the local file system, replace `nullStream` with `writeStream`
        // const writeStream = fs.createWriteStream(path.join(__dirname, `../../../avatars/${image.filename}`))

        // const nullStream = new Writable({
        //     write(_chunk, _encoding, cb) {
        //         cb();
        //     }
        // });
        //
        //
        const avatarKey = 'oliver';

        const imageStream = new ImageStream(avatarKey)
            .on('finish', () => {
                imageStream.getStore().setMimeType(avatarKey, image.mimetype);
                this.logger.log('Image stream received image...');
            })
            .on('error', (err) => {
                this.logger.error(err);
            });

        this.logger.log('Uploading avatar');
        return new Promise((resolve, reject) => {
            image
                .createReadStream()
                .pipe(imageStream)
                .on('finish', () => resolve(true))
                .on('error', () => reject(false));
        });
    }
}
