import { Request, Response } from 'express';
import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserResolver } from '../user.resolver';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';

const ollie = {
    id: '05fc4d47-b88c-4494-86e9-b64d748e1df6',
    firstName: 'Ollie',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    displayName: 'Oliver Queen',
    password: '123456',
    refreshTokenId: 0
};

class UserRepositoryFake {
    public create(): void {
        /* empty */
    }
    public async save(): Promise<void> {
        /* empty */
    }
    public async find(): Promise<void> {
        /* empty */
    }
    public async findOne(): Promise<void> {
        /* empty */
    }
}

describe('User resolver', () => {
    let userService: UserService;
    let userResolver: UserResolver;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UserResolver,
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: UserRepositoryFake
                }
            ]
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
        userResolver = moduleRef.get<UserResolver>(UserResolver);
    });

    describe('registerUser mutation', () => {
        it('creates a new user', async () => {
            const createSpy = jest.spyOn(userService, 'create').mockResolvedValue(ollie);
            const result = await userResolver.registerUser({
                firstName: ollie.firstName,
                lastName: ollie.lastName,
                email: ollie.email,
                password: ollie.password
            });
            expect(result).toBe(ollie);
            expect(createSpy).toHaveBeenCalled();
        });
    });

    describe('users query', () => {
        it('returns an array of users', async () => {
            const result = [];
            const getAllUsersSpy = jest.spyOn(userService, 'getAllUsers').mockResolvedValue(result);

            expect(await userResolver.getUsers()).toBe(result);
            expect(getAllUsersSpy).toHaveBeenCalled();
        });
    });

    describe('user query', () => {
        it('returns the user with the given id', async () => {
            const findUserByIdSpy = jest.spyOn(userService, 'findById').mockResolvedValue(ollie);
            expect(await userResolver.getUser(ollie.id)).toEqual(ollie);
            expect(findUserByIdSpy).toHaveBeenCalled();
        });
    });

    describe('me query', () => {
        it('returns null if user is not logged in', () => {
            const req = {} as Request;
            const res = {} as Response;
            const result = userResolver.me({ req, res });
            expect(result).toBeNull();
        });

        it('returns the currently logged in user', () => {
            const ollie = {
                id: '05fc4d47-b88c-4494-86e9-b64d748e1df6',
                firstName: 'Ollie',
                lastName: 'Queen',
                email: 'oliver@qc.com',
                displayName: 'Oliver Queen',
                password: '123456',
                refreshTokenId: 0
            };
            const req = {} as Request;
            req.user = ollie;
            const res = {} as Response;
            const result = userResolver.me({ req, res });
            expect(result).toBe(ollie);
        });
    });

    describe('displayName field resolver', () => {
        const ollie = {
            id: '05fc4d47-b88c-4494-86e9-b64d748e1df6',
            firstName: 'Ollie',
            lastName: 'Queen',
            email: 'oliver@qc.com',
            displayName: '',
            password: '123456',
            refreshTokenId: 0
        };

        it('returns a concatenation of first and last names', () => {
            expect(userResolver.getDisplayName(ollie)).toBe(`${ollie.firstName} ${ollie.lastName}`);
        });
    });
});
