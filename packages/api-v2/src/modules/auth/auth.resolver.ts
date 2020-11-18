import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => Boolean)
    async login(
        @Args('email') email: string,
        @Args('password') password: string
    ): Promise<boolean> {
        const isAuth = await this.authService.authenticateUser(email, password);
        return isAuth ? true : false;
    }
}
