import { Request, Response } from 'express';
import { Logger, ParseUUIDPipe, UseGuards } from '@nestjs/common';
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
    private readonly logger = new Logger(UserResolver.name);
    constructor(private readonly userService: UserService) {}

    @Query(() => [User], { name: 'users' })
    @UseGuards(AuthGuard)
    getUsers(): Promise<User[]> {
        this.logger.log('Fetching all users');
        return this.userService.getAllUsers();
    }

    @Query(() => User, { name: 'user' })
    @UseGuards(AuthGuard)
    getUser(@Args('id', ParseUUIDPipe) id: string): Promise<User> {
        this.logger.log('Fetching user by id');
        return this.userService.findById(id);
    }

    @ResolveField('displayName', (_returns) => String)
    getDisplayName(@Parent() user: User) {
        this.logger.log('Resolving display name');
        return `${user.firstName} ${user.lastName}`;
    }

    @Mutation(() => User)
    async registerUser(@Args('userData') userData: RegisterUserInput): Promise<User> {
        this.logger.log('Registering new user');
        const newUser = await this.userService.create(userData);
        return newUser;
    }

    @Query(() => User, { nullable: true })
    me(@Context() { req }: GraphQLContext): User | null {
        if (req.user) {
            this.logger.log('Fetching context (authenticated) user');
            return req.user;
        }
        return null;
    }
}
