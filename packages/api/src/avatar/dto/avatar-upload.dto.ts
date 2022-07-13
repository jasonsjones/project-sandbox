import { Field, InputType } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class AvatarUploadInput {
    @Field()
    userId: string;

    @Field(() => GraphQLUpload)
    image: Promise<FileUpload>;
}
