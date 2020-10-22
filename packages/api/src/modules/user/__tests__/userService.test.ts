import UserService from '../UserService';

describe('User service', () => {
    let userService: UserService;

    beforeAll(() => {
        userService = new UserService();
    });

    afterEach(() => {
        userService.removeAllUsers();
    });

    describe('createUser()', () => {
        it('creates a new user', async () => {
            const result = await userService?.createUser(
                'Oliver',
                'Queen',
                'oliver@qc.com',
                'secret'
            );

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
        beforeAll(async () => {
            await userService.createUser('Barry', 'Allen', 'barry@starlabs.com', 'theflash');
        });

        it('fetches all users', async () => {
            const users = await userService.getAllUsers();
            expect(users).toHaveLength(1);
        });
    });

    describe('getUserById()', () => {
        let userId: string;

        beforeAll(async () => {
            await userService.createUser('Barry', 'Allen', 'barry@starlabs.com', 'theflash');

            const vibe = await userService.createUser(
                'Cisco',
                'Ramon',
                'cisco@starlabs.com',
                'thevibe'
            );
            userId = vibe.id;
        });

        it('fetches users with the given id', async () => {
            const user = await userService.getUserById(userId);
            expect(user?.email).toEqual('cisco@starlabs.com');
        });
    });

    describe('removeAllUsers()', () => {
        beforeAll(async () => {
            await userService.createUser('Barry', 'Allen', 'barry@starlabs.com', 'theflash');
            await userService.createUser('Cisco', 'Ramon', 'cisco@starlabs.com', 'thevibe');
        });

        it('clears all users', async () => {
            expect(await userService.getAllUsers()).toHaveLength(2);
            await userService.removeAllUsers();
            expect(await userService.getAllUsers()).toHaveLength(0);
        });
    });
});
