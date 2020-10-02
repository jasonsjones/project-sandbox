import { Application } from 'express';
import createApp from '../config/app';
import { makeGraphQLCall } from '../testutils';
import UserService from '../modules/user/UserService';

let app: Application;

beforeAll(async () => {
    app = await createApp();
});

describe('User resolver', () => {
    let userService: UserService;

    beforeAll(() => {
        userService = new UserService();
    });

    afterEach(() => {
        userService.removeAllUsers();
    });

    describe('register user mutation', () => {
        it('creates a new user', () => {
            const registerUserOp = `
                mutation RegisterUser($userData: RegisterUserInput!) {
                    registerUser(userData: $userData) {
                        user {
                            id
                            email
                        }
                    }
                }`;

            const queryVariables = {
                userData: {
                    email: 'oliver@qc.com',
                    password: '123456'
                }
            };

            return makeGraphQLCall(app, registerUserOp, queryVariables).then((res) => {
                const { registerUser } = res.body.data;
                expect(registerUser).toEqual(
                    expect.objectContaining({
                        user: expect.objectContaining({
                            id: expect.any(String),
                            email: 'oliver@qc.com'
                        })
                    })
                );
            });
        });

        describe('users query', () => {
            beforeAll(() => {
                userService.createUser('barry@starlabs.com', '123456');
                userService.createUser('diggle@qc.com', '123456');
            });

            it('fetches all the users', () => {
                const usersQuery = `
                query {
                    users {
                        id
                        email
                    }
                }`;

                return makeGraphQLCall(app, usersQuery).then((res) => {
                    const { users } = res.body.data;
                    expect(users).toHaveLength(2);
                    expect(users).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                id: expect.any(String),
                                email: 'barry@starlabs.com'
                            }),
                            expect.objectContaining({
                                id: expect.any(String),
                                email: 'diggle@qc.com'
                            })
                        ])
                    );
                });
            });
        });

        describe('user query', () => {
            let userId: string;

            beforeAll(() => {
                const cisco = userService.createUser('cisco@starlabs.com', '123456');
                userId = cisco.id;
            });

            it('fetches the user with the given id', () => {
                const userQueryOp = `
                query GetUser($id: String!){
                    user(id: $id) {
                        id
                        email
                    }
                }`;

                const queryVariables = {
                    id: userId
                };

                return makeGraphQLCall(app, userQueryOp, queryVariables).then((res) => {
                    const { user } = res.body.data;
                    expect(user).toEqual(
                        expect.objectContaining({
                            id: expect.any(String),
                            email: 'cisco@starlabs.com'
                        })
                    );
                });
            });
        });
    });
});
