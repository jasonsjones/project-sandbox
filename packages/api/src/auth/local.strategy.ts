import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        });
    }

    async validate(email: string, password: string): Promise<any> {
        this.logger.log('Validating user on login');
        const user = await this.authService.authenticateUser(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }

        // remove the password field from the authenicated user
        const { password: _password, ...result } = user;
        return result;
    }
}
