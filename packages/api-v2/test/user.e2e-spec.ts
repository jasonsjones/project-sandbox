import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/modules/user/create-user.dto';
import { UserService } from '../src/modules/user/user.service';

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

const userQuery = `
query {
    users {
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

describe('User resolver (e2e)', () => {
    let app: INestApplication;
    let userService: UserService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        userService = moduleFixture.get<UserService>(UserService);
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
        it('fetches all users', async () => {
            await userService.create(barry);
            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({ query: userQuery })
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
    });
});
