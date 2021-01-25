import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

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
    constructor(private authService: AuthService, private userService: UserService) {}

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

        const accessToken = this.authService.generateAccessToken(authUser);
        const refreshToken = this.authService.generateRefreshToken(authUser);
        res.cookie('qid', refreshToken, { httpOnly: true });
        return {
            accessToken
        };
    }

    @Mutation(() => LoginResponse)
    async refreshAccessToken(@Context() { req, res }: GraphQLContext): Promise<LoginResponse> {
        const refreshToken = req.cookies['qid'];
        if (refreshToken) {
            let payload;

            try {
                payload = this.authService.verifyToken(req.cookies.qid);
            } catch (error) {
                if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                    res.clearCookie('qid');
                }
                return {
                    accessToken: null
                };
            }

            if (payload.email) {
                const user = await this.userService.findByEmail(payload.email as string);
                if (user && user.refreshTokenId === payload.tokenId) {
                    const accessToken = this.authService.generateAccessToken(user);
                    const refreshToken = this.authService.generateRefreshToken(user);

                    res.cookie('qid', refreshToken, { httpOnly: true });

                    return {
                        accessToken
                    };
                } else {
                    res.clearCookie('qid');
                }
            }
        }

        return {
            accessToken: null
        };
    }
}
