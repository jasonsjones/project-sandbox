import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
    private users: User[] = [];

    async create({ firstName, lastName, email, password }: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User();

        newUser.id = v4();
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.email = email;
        newUser.password = hashedPassword;

        this.users = [...this.users, newUser];
        return Promise.resolve(newUser);
    }

    getAllUsers(): Promise<User[]> {
        return Promise.resolve(this.users);
    }
}
