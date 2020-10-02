import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import User from './User';
import { AppContext } from '../../types';
import { IsEmail } from 'class-validator';

/*
@ObjectType()
class PayloadType {
    @Field()
    users?: User[];
    @Field()
    user?: User;
}

@ObjectType()
class MutationResponse {
    @Field()
    success!: boolean;

    @Field()
    message!: string;

    @Field({ nullable: true })
    payload?: PayloadType;
}
*/

@ObjectType()
class RegisterUserPayload {
    @Field()
    user!: User;
}

@InputType()
class RegisterUserInput {
    @Field()
    @IsEmail()
    email!: string;

    @Field()
    password!: string;
}

@Resolver()
class UserResolver {
    @Query(() => [User])
    users(@Ctx() { dataSources }: AppContext): User[] {
        return dataSources.userService.getAllUsers();
    }

    @Query(() => User, { nullable: true })
    user(@Arg('id') id: string, @Ctx() { dataSources }: AppContext): User | undefined {
        return dataSources.userService.getUserById(id);
    }

    @Mutation(() => RegisterUserPayload)
    registerUser(
        @Arg('userData') userData: RegisterUserInput,
        @Ctx() { dataSources }: AppContext
    ): RegisterUserPayload {
        const newUser = dataSources.userService.createUser(userData.email, userData.password);
        return { user: newUser };
    }
}

export default UserResolver;
