import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

const seedUser = {
    firstName: 'Oliver',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: '123456'
};

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserResolver, UserService],
    exports: [UserService]
})
export class UserModule implements OnModuleInit {
    private readonly logger = new Logger(UserModule.name);

    constructor(private userService: UserService) {}

    async onModuleInit() {
        if (process.env.NODE_ENV === 'development') {
            const users = await this.userService.getAllUsers();
            if (users.length === 0) {
                this.logger.log(`Creating seed user: ${seedUser.email} / ${seedUser.password}`);
                await this.userService.create(seedUser);
            }
        }
    }
}
