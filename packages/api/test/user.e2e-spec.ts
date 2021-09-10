import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/user/create-user.dto';
import { UserService } from '../src/user/user.service';
import { AuthService } from '../src/auth/auth.service';

const oliver: CreateUserDto = {
    firstName: 'Ollie',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: '123456'
};

const barry: CreateUserDto = {
    firstName: 'Barry',
    lastName: 'Allen',
    email: 'barry@starlabs.com',
    password: 'secretpassword'
};

const usersQuery = `
query {
    users {
        id
        firstName
        lastName
        displayName
        email
    }
}`;

const userQuery = `
query getUserById($id: String!) {
    user(id: $id) {
        id
        firstName
        lastName
        displayName
        email
    }
}`;

const RegisterUserOp = `
mutation RegisterUser($userData: RegisterUserInput!) {
    registerUser(userData: $userData) {
        id
        firstName
        lastName
        displayName
        email
    }
}`;

const meQuery = `
query {
    me {
        id
        firstName
        lastName
        displayName
        email
    }
}`;

describe('User resolver (e2e)', () => {
    let app: INestApplication;
    let userService: UserService;
    let authService: AuthService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        userService = moduleFixture.get<UserService>(UserService);
        authService = moduleFixture.get<AuthService>(AuthService);
        app = moduleFixture.createNestApplication();
        await app.init();
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
            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({ query: RegisterUserOp, variables: queryVariables })
                .expect(({ body }) => {
                    const { registerUser } = body.data;
                    expect(registerUser).toEqual(
                        expect.objectContaining({
                            id: expect.any(String),
                            firstName: oliver.firstName,
                            lastName: oliver.lastName,
                            displayName: `${oliver.firstName} ${oliver.lastName}`,
                            email: oliver.email
                        })
                    );
                });
        });
    });

    describe('users query', () => {
        it('fetches all users with a valid access token', async () => {
            const user = await userService.create(barry);
            const accessToken = authService.generateAccessToken(user);

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ query: usersQuery })
                .expect(({ body }) => {
                    const { users } = body.data;
                    expect(users).toHaveLength(1);
                    expect(users).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                id: expect.any(String),
                                firstName: barry.firstName,
                                lastName: barry.lastName,
                                displayName: `${barry.firstName} ${barry.lastName}`,
                                email: barry.email
                            })
                        ])
                    );
                });
        });

        it('protects the user resource when requested with no token', async () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({ query: usersQuery })
                .expect(({ body }) => {
                    expect(body.errors).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({ message: 'Forbidden resource' })
                        ])
                    );
                    expect(body.data).toBeNull();
                });
        });

        it('protects the user resource when requested with an invalid token', async () => {
            const accessToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ query: usersQuery })
                .expect(({ body }) => {
                    expect(body.errors).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({ message: 'Forbidden resource' })
                        ])
                    );
                    expect(body.data).toBeNull();
                });
        });
    });

    describe('user (by id) query', () => {
        it('fetches the user with the given id', async () => {
            const mainUser = await userService.create(barry);
            const otherUser = await userService.create(oliver);
            const accessToken = authService.generateAccessToken(mainUser);
            const idToFind = otherUser.id;

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ query: userQuery, variables: { id: idToFind } })
                .expect(({ body }) => {
                    const { user } = body.data;
                    expect(user).toEqual(
                        expect.objectContaining({
                            id: expect.any(String),
                            firstName: oliver.firstName,
                            lastName: oliver.lastName,
                            displayName: `${oliver.firstName} ${oliver.lastName}`,
                            email: oliver.email
                        })
                    );
                });
        });

        it('protects the single user (by id) resource when no token is present', () => {
            const unknownId = 'f65504ef-e934-4094-8fe3-af7d4762de88';

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({ query: userQuery, variables: { id: unknownId } })
                .expect(({ body }) => {
                    expect(body.errors).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({ message: 'Forbidden resource' })
                        ])
                    );
                    expect(body.data).toBeNull();
                });
        });

        it('protects the single user (by id) resource when an invalid token is provided', async () => {
            await userService.create(barry);
            const otherUser = await userService.create(oliver);
            const idToFind = otherUser.id;
            const accessToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ query: userQuery, variables: { id: idToFind } })
                .expect(({ body }) => {
                    expect(body.errors).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({ message: 'Forbidden resource' })
                        ])
                    );
                    expect(body.data).toBeNull();
                });
        });
    });

    describe('me query', () => {
        it('returns the user represented in the jwt access token', async () => {
            const user = await userService.create(barry);
            const accessToken = authService.generateAccessToken(user);
            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ query: meQuery })
                .expect(({ body }) => {
                    const { me } = body.data;
                    expect(me).toEqual(
                        expect.objectContaining({
                            id: expect.any(String),
                            firstName: barry.firstName,
                            lastName: barry.lastName,
                            displayName: `${barry.firstName} ${barry.lastName}`,
                            email: barry.email
                        })
                    );
                });
        });

        it('returns null if token is invalid', () => {
            const accessToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ query: meQuery })
                .expect(({ body }) => {
                    const { me } = body.data;
                    expect(me).toBeNull();
                });
        });

        it('returns null if no token is provided', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({ query: meQuery })
                .expect(({ body }) => {
                    const { me } = body.data;
                    expect(me).toBeNull();
                });
        });
    });
});
