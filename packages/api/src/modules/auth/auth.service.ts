import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    async authenticateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }

    async generateAccessToken(user: User): Promise<string | null> {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload, { expiresIn: '10m' });
    }

    async generateRefreshToken(user: User): Promise<string | null> {
        const payload = { sub: user.id, email: user.email, tokenId: user.refreshTokenId };
        return this.jwtService.sign(payload, { expiresIn: '14d' });
    }
}
