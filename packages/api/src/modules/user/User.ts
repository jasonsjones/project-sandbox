import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ description: 'The user model' })
class User {
    @Field(() => ID, { description: 'The unique id of the user' })
    id!: string;

    @Field(() => String)
    email!: string;

    password!: string;
}

export default User;
