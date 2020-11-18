import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async authenticateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }
}
