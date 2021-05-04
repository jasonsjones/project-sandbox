import { Injectable, Logger } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private configService: ConfigService,
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async authenticateUser(email: string, password: string): Promise<User | null> {
        this.logger.log('Authenticating user');
        const user = await this.userService.findByEmail(email);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }

    generateAccessToken(user: User): string {
        this.logger.log('Generatring access token');
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload, { expiresIn: '10m' });
    }

    generateRefreshToken(user: User): string {
        this.logger.log('Generatring refresh token');
        const payload = { sub: user.id, email: user.email, tokenId: user.refreshTokenId };
        return this.jwtService.sign(payload, { expiresIn: '14d' });
    }

    verifyToken(token: string): Record<string, string | number> {
        this.logger.log('Verifying token');
        const tokenSecret = this.configService.get<string>('JWT_SECRET');
        return this.jwtService.verify(token, { secret: tokenSecret });
    }
}
