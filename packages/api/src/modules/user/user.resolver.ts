import { UseGuards } from '@nestjs/common';
import {
    Query,
    Resolver,
    InputType,
    Field,
    Mutation,
    Args,
    ResolveField,
    Parent
} from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@InputType()
class RegisterUserInput {
    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field()
    email!: string;

    @Field()
    password!: string;
}

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => [User], { name: 'users' })
    @UseGuards(AuthGuard)
    getUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @ResolveField('displayName', (_returns) => String)
    getDisplayName(@Parent() user: User) {
        return `${user.firstName} ${user.lastName}`;
    }

    @Mutation(() => User)
    async registerUser(@Args('userData') userData: RegisterUserInput): Promise<User> {
        const newUser = await this.userService.create(userData);
        return newUser;
    }
}
