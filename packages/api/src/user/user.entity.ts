import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'The user model' })
export class User {
    @Field(() => ID, { description: 'The unique ID of the user' })
    id!: string;

    @Field(() => String)
    firstName!: string;

    @Field(() => String)
    lastName!: string;

    @Field(() => String)
    email!: string;

    @Field(() => String)
    displayName!: string;

    password!: string;

    refreshTokenId!: number;
}
