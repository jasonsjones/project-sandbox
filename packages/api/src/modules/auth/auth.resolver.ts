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
    ): Promise<LoginResponse | undefined> {
        const authUser = await this.authService.authenticateUser(email, password);
        let accessToken: string | null = null;
        if (authUser) {
            accessToken = await this.authService.generateAccessToken(authUser);
        }
        return {
            accessToken
        };
    }
}
