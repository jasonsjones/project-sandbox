import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

interface GraphQLContext {
    req: Request;
    res: Response;
}
@ObjectType()
class LoginResponse {
    @Field({ nullable: true })
    accessToken: string;
}

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => LoginResponse)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context() { res }: GraphQLContext
    ): Promise<LoginResponse | UnauthorizedException> {
        const authUser = await this.authService.authenticateUser(email, password);

        if (!authUser) {
            return new UnauthorizedException();
        }

        const accessToken = await this.authService.generateAccessToken(authUser);
        const refreshToken = await this.authService.generateRefreshToken(authUser);
        res.cookie('qid', refreshToken, { httpOnly: true });
        return {
            accessToken
        };
    }
}
