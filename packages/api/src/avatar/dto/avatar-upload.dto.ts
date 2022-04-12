import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class AvatarUploadInput {
    @Field()
    userId: string;

    @Field(() => GraphQLUpload)
    image: Promise<FileUpload>;
}
