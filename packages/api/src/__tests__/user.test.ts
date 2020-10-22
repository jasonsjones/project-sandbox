import { Application } from 'express';
import createApp from '../config/app';
import {
    makeGraphQLCall,
    oliver,
    dig,
    barry,
    cisco,
    GetUserOp,
    RegisterUserOp,
    UserQuery
} from '../testutils';
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
            const queryVariables = {
                userData: {
                    firstName: oliver.firstName,
                    lastName: oliver.lastName,
                    email: oliver.email,
                    password: oliver.password
                }
            };

            return makeGraphQLCall(app, RegisterUserOp, queryVariables).then((res) => {
                const { registerUser } = res.body.data;
                expect(registerUser).toEqual(
                    expect.objectContaining({
                        user: expect.objectContaining({
                            id: expect.any(String),
                            firstName: oliver.firstName,
                            lastName: oliver.lastName,
                            displayName: `${oliver.firstName} ${oliver.lastName}`,
                            email: oliver.email
                        })
                    })
                );
            });
        });

        describe('users query', () => {
            beforeAll(async () => {
                await userService.createUser(
                    barry.firstName,
                    barry.lastName,
                    barry.email,
                    barry.password
                );
                await userService.createUser(dig.firstName, dig.lastName, dig.email, dig.password);
            });

            it('fetches all the users', () => {
                return makeGraphQLCall(app, UserQuery).then((res) => {
                    const { users } = res.body.data;
                    expect(users).toHaveLength(2);
                    expect(users).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                id: expect.any(String),
                                firstName: barry.firstName,
                                lastName: barry.lastName,
                                displayName: `${barry.firstName} ${barry.lastName}`,
                                email: barry.email
                            }),
                            expect.objectContaining({
                                id: expect.any(String),
                                firstName: dig.firstName,
                                lastName: dig.lastName,
                                displayName: `${dig.firstName} ${dig.lastName}`,
                                email: dig.email
                            })
                        ])
                    );
                });
            });
        });

        describe('user query', () => {
            let userId: string;

            beforeAll(async () => {
                const ciscoUser = await userService.createUser(
                    cisco.firstName,
                    cisco.lastName,
                    cisco.email,
                    cisco.password
                );
                userId = ciscoUser.id;
            });

            it('fetches the user with the given id', () => {
                const queryVariables = {
                    id: userId
                };

                return makeGraphQLCall(app, GetUserOp, queryVariables).then((res) => {
                    const { user } = res.body.data;
                    expect(user).toEqual(
                        expect.objectContaining({
                            id: expect.any(String),
                            firstName: cisco.firstName,
                            lastName: cisco.lastName,
                            displayName: `${cisco.firstName} ${cisco.lastName}`,
                            email: cisco.email
                        })
                    );
                });
            });
        });
    });
});
