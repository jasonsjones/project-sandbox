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
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
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
    @UseGuards(JwtAuthGuard)
    getUsers(): Promise<User[]> {
        this.logger.log('Fetching all users');
        return this.userService.getAllUsers();
    }

    @Query(() => User, { name: 'user' })
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    me(@Context() { req }: GraphQLContext): User | null {
        this.logger.log('Fetching context (authenticated) user');
        return <User>req.user;
    }
}
