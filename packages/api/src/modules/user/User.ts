import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ description: 'The user model' })
class User {
    @Field(() => ID, { description: 'The unique id of the user' })
    id!: string;

    @Field(() => String)
    firstName!: string;

    @Field(() => String)
    lastName!: string;

    @Field(() => String)
    email!: string;

    @Field(() => String, { nullable: true })
    displayName(): string | null {
        return `${this.firstName} ${this.lastName}`;
    }

    password!: string;
}

export default User;
