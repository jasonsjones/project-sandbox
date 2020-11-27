import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserResolver } from '../user.resolver';

describe('User resolver', () => {
    let userService: UserService;
    let userResolver: UserResolver;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [UserService, UserResolver]
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
        userResolver = moduleRef.get<UserResolver>(UserResolver);
    });

    describe('registerUser mutation', () => {
        const ollie = {
            id: '05fc4d47-b88c-4494-86e9-b64d748e1df6',
            firstName: 'Ollie',
            lastName: 'Queen',
            email: 'oliver@qc.com',
            displayName: 'Oliver Queen',
            password: '123456'
        };

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

    describe('displayName field resolver', () => {
        const ollie = {
            id: '05fc4d47-b88c-4494-86e9-b64d748e1df6',
            firstName: 'Ollie',
            lastName: 'Queen',
            email: 'oliver@qc.com',
            displayName: '',
            password: '123456'
        };

        it('returns a concatenation of first and last names', () => {
            expect(userResolver.getDisplayName(ollie)).toBe(`${ollie.firstName} ${ollie.lastName}`);
        });
    });
});
