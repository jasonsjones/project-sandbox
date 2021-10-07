import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = this.userRepository.create();

        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.email = email;
        newUser.password = hashedPassword;
        newUser.refreshTokenId = 0;

        this.logger.log('Creating new user');
        return this.userRepository.save(newUser);
    }

    getAllUsers(): Promise<User[]> {
        this.logger.log('Fetching all users');
        return this.userRepository.find();
    }

    findByEmail(email: string): Promise<User | undefined> {
        this.logger.log('Fetching user by email');
        return this.userRepository.findOne({ where: { email } });
    }

    findById(id: string): Promise<User | undefined> {
        this.logger.log('Fetching user by id');
        return this.userRepository.findOne(id);
    }
}
