import { Request, Response } from 'express';
import { UseGuards } from '@nestjs/common';
import {
    Query,
    Resolver,
    InputType,
    Field,
    Mutation,
    Args,
    ResolveField,
    Parent,
    Context
} from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

interface GraphQLContext {
    req: Request;
    res: Response;
}

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

    @Query(() => User, { nullable: true })
    me(@Context() { req }: GraphQLContext): User | null {
        if (req.user) {
            return req.user;
        }
        return null;
    }
}
