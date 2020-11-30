import { UnauthorizedException } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

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
        @Args('password') password: string
    ): Promise<LoginResponse | UnauthorizedException> {
        const authUser = await this.authService.authenticateUser(email, password);

        if (!authUser) {
            return new UnauthorizedException();
        }

        const accessToken = await this.authService.generateAccessToken(authUser);
        return {
            accessToken
        };
    }
}
