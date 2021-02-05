import cookieParser from 'cookie-parser';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/auth.service';
import { CreateUserDto } from '../src/modules/user/create-user.dto';
import { UserService } from '../src/modules/user/user.service';

const oliver: CreateUserDto = {
    firstName: 'Ollie',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: '123456'
};

const loginOp = `
mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        accessToken
    }
}`;

const refreshAccessTokenQuery = `
query {
    refreshAccessToken {
        accessToken
    }
}
`;

describe('Auth resolver (e2e)', () => {
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
        app.use(cookieParser());
        await app.init();
    });

    describe('login mutation', () => {
        it('authenticates a user with a valid email and password', async () => {
            await userService.create(oliver);
            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({
                    query: loginOp,
                    variables: { email: oliver.email, password: oliver.password }
                })
                .expect(({ body }) => {
                    const { accessToken } = body.data.login;
                    expect(accessToken.length).toBeGreaterThan(0);
                });
        });

        it('does not authenticate a user with an invalid email', async () => {
            await userService.create(oliver);

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({
                    query: loginOp,
                    variables: { email: 'unknown-email@qc.com', password: oliver.password }
                })
                .expect(({ body }) => {
                    expect(body.data).toBeNull();
                    expect(body.errors).toHaveLength(1);
                    expect(body.errors[0].message).toBe('Unauthorized');
                });
        });

        it('does not authenticate a user with an invalid password', async () => {
            await userService.create(oliver);

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({
                    query: loginOp,
                    variables: { email: oliver.email, password: 'wrong-password' }
                })
                .expect(({ body }) => {
                    expect(body.data).toBeNull();
                    expect(body.errors).toHaveLength(1);
                    expect(body.errors[0].message).toBe('Unauthorized');
                    expect(body.errors[0].extensions.exception.status).toBe(401);
                });
        });
    });

    describe('refreshAccessToken mutation', () => {
        it('refreshes access token with valid refresh token', async () => {
            const ollie = await userService.create(oliver);
            const refreshToken = authService.generateRefreshToken(ollie);

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Cookie', [`qid=${refreshToken}`])
                .send({
                    query: refreshAccessTokenQuery,
                    variables: {}
                })
                .expect(({ body }) => {
                    const { accessToken } = body.data.refreshAccessToken;
                    expect(accessToken.length).toBeGreaterThan(0);
                    expect(accessToken).not.toEqual(refreshToken);
                });
        });

        it('does not refresh access token without a refresh token', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({
                    query: refreshAccessTokenQuery,
                    variables: {}
                })
                .expect(({ body }) => {
                    const { accessToken } = body.data.refreshAccessToken;
                    expect(accessToken).toBeNull();
                });
        });

        it('does not refresh access token if refresh token is expired', async () => {
            const twoHoursAgo = new Date();
            twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
            jest.spyOn(authService, 'verifyToken').mockImplementation(() => {
                throw new TokenExpiredError('jwt expired', twoHoursAgo);
            });

            const ollie = await userService.create(oliver);
            const refreshToken = authService.generateRefreshToken(ollie);

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Cookie', [`qid=${refreshToken}`])
                .send({
                    query: refreshAccessTokenQuery,
                    variables: {}
                })
                .expect(({ body }) => {
                    const { accessToken } = body.data.refreshAccessToken;
                    expect(accessToken).toBeNull();
                });
        });

        it('does not refresh access token if refresh token is otherwise invalid', async () => {
            jest.spyOn(authService, 'verifyToken').mockImplementation(() => {
                throw new JsonWebTokenError('jwt malformed');
            });

            const ollie = await userService.create(oliver);
            const refreshToken = authService.generateRefreshToken(ollie);

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Cookie', [`qid=${refreshToken}`])
                .send({
                    query: refreshAccessTokenQuery,
                    variables: {}
                })
                .expect(({ body }) => {
                    const { accessToken } = body.data.refreshAccessToken;
                    expect(accessToken).toBeNull();
                });
        });
    });
});
