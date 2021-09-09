import { Injectable, Logger } from '@nestjs/common';
import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    private users: User[] = [];

    async create({ firstName, lastName, email, password }: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User();

        newUser.id = v4();
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.email = email;
        newUser.password = hashedPassword;
        newUser.refreshTokenId = 0;

        this.users = [...this.users, newUser];

        this.logger.log('Creating new user');
        return Promise.resolve(newUser);
    }

    getAllUsers(): Promise<User[]> {
        this.logger.log('Fetching all users');
        return Promise.resolve(this.users);
    }

    findByEmail(email: string): Promise<User | undefined> {
        this.logger.log('Fetching user by email');
        const foundUser = this.users.find((user) => user.email === email);
        return Promise.resolve(foundUser);
    }

    findById(id: string): Promise<User | undefined> {
        this.logger.log('Fetching user by id');
        const foundUser = this.users.find((user) => user.id === id);
        return Promise.resolve(foundUser);
    }
}
