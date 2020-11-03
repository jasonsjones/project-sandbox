import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'The avatar model' })
class Avatar {
    @Field(() => ID, { description: 'The unique id of the avatar' })
    id!: string;

    @Field(() => String)
    path!: string;

    @Field(() => String)
    filename!: string;
}

export default Avatar;
