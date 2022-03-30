import { Request, Response } from 'express';
import { Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login-input.dto';
import { LoginResponse } from './dto/login-response.dto';
import { GqlAuthGuard } from './auth-gql.guard';
import { User } from 'src/user/user.entity';

interface GraphQLContext {
    req: Request;
    res: Response;
    user?: User;
}

@Resolver()
export class AuthResolver {
    private readonly logger = new Logger(AuthResolver.name);

    constructor(private authService: AuthService, private userService: UserService) {}

    @Mutation(() => LoginResponse)
    @UseGuards(GqlAuthGuard)
    async login(
        @Args('loginInput') _loginInput: LoginInput,
        @Context() ctx: GraphQLContext
    ): Promise<LoginResponse> {
        this.logger.log('login mutation: user authenticated');
        // if we get here, then the user was successfully authenticated via
        // the auth guard (local strategy), so we can get the user from context
        const { res, user } = ctx;

        const accessToken = this.authService.generateAccessToken(user);
        const refreshToken = this.authService.generateRefreshToken(user);
        res.cookie('qid', refreshToken, { httpOnly: true });
        return {
            accessToken
        };
    }

    @Mutation(() => Boolean)
    logout(@Context() { res }: GraphQLContext): boolean {
        this.logger.log('Logging out user');

        res.clearCookie('qid');
        return true;
    }

    @Mutation(() => LoginResponse)
    async refreshAccessToken(
        @Context() { req, res }: GraphQLContext
    ): Promise<{ accessToken: string }> {
        this.logger.log('Attempting to refresh access token');

        const refreshToken = req.cookies['qid'];
        if (refreshToken) {
            let payload: Record<string, string | number>;

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
                    this.logger.log('Refreshing access token');
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
