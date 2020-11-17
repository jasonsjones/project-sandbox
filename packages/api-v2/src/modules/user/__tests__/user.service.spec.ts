import { Test } from '@nestjs/testing';
import { CreateUserDto } from '../create-user.dto';
import { UserService } from '../user.service';

const oliver: CreateUserDto = {
    firstName: 'Oliver',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: 'secretpassword'
};

const barry: CreateUserDto = {
    firstName: 'Barry',
    lastName: 'Allen',
    email: 'barry@starlabs.com',
    password: 'secretpassword'
};

const cisco: CreateUserDto = {
    firstName: 'Ciso',
    lastName: 'Ramon',
    email: 'cisco@starlabs.com',
    password: 'secretpassword'
};

describe('User service', () => {
    let userService: UserService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [UserService]
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
    });

    describe('createUser()', () => {
        it('creates a new user', async () => {
            const result = await userService.create(oliver);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    firstName: oliver.firstName,
                    lastName: oliver.lastName,
                    email: oliver.email,
                    password: expect.any(String)
                })
            );
        });

        it("hashes the user's password before saving", async () => {
            const result = await userService.create(oliver);
            expect(result.password).not.toEqual(oliver.password);
            expect(result.password).toMatch(/^\$2*/);
        });
    });

    describe('getAllUsers()', () => {
        it('fetches all users', async () => {
            await userService.create(barry);
            await userService.create(cisco);

            const users = await userService.getAllUsers();
            expect(users).toHaveLength(2);
        });
    });

    describe('findByEmail()', () => {
        it('fetches a user with the given email', async () => {
            await userService.create(barry);
            const result = await userService.findByEmail(barry.email);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    firstName: barry.firstName,
                    lastName: barry.lastName,
                    email: barry.email,
                    password: expect.any(String)
                })
            );
        });

        it('returns undefined if a user is not found with the given email', async () => {
            await userService.create(cisco);
            const unknownUser = await userService.findByEmail(barry.email);
            expect(unknownUser).toBeUndefined();
        });
    });
});
