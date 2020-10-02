import UserService from '../UserService';

describe('User service', () => {
    const userService: UserService = new UserService();

    afterEach(() => {
        userService?.cleanUsers();
    });

    describe('createUser()', () => {
        it('creates a new user', () => {
            // const userService = new UserService();
            const result = userService?.createUser('oliver@qc.com', 'secret');

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    email: 'oliver@qc.com',
                    password: 'secret'
                })
            );
        });
    });

    describe('getAllUsers()', () => {
        beforeAll(() => {
            userService.createUser('barry@starlabs.com', 'theflash');
        });

        it('fetches all users', () => {
            expect(userService.getAllUsers()).toHaveLength(1);
        });
    });

    describe('getUserById()', () => {
        let userId: string;

        beforeAll(() => {
            userService.createUser('barry@starlabs.com', 'theflash');

            const vibe = userService.createUser('cisco@starlabs.com', 'thevibe');
            userId = vibe.id;
        });

        it('fetches users with the given id', () => {
            const user = userService.getUserById(userId);
            expect(user?.email).toEqual('cisco@starlabs.com');
        });
    });

    describe('cleanUsers()', () => {
        beforeAll(() => {
            userService.createUser('barry@starlabs.com', 'theflash');
            userService.createUser('cisco@starlabs.com', 'thevibe');
        });

        it('clears all users', () => {
            expect(userService.getAllUsers()).toHaveLength(2);
            userService.cleanUsers();
            expect(userService.getAllUsers()).toHaveLength(0);
        });
    });
});
