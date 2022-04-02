import cookieParser from 'cookie-parser';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { CreateUserDto } from '../src/user/create-user.dto';
import { UserService } from '../src/user/user.service';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from '../src/auth/auth.module';
import { UserModule } from '../src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { User } from '../src/user/user.entity';
import { loginOp, logoutOp, refreshAccessTokenOp } from './utils/constants';

const oliver: CreateUserDto = {
    firstName: 'Ollie',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: '123456'
};

describe('Auth resolver (e2e)', () => {
    let app: INestApplication;
    let userService: UserService;
    let authService: AuthService;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                GraphQLModule.forRoot({
                    autoSchemaFile: 'src/schema.gql',
                    cors: {
                        origin: ['http://localhost:4200'],
                        credentials: true
                    },
                    context: ({ req, res }) => ({ req, res })
                }),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    synchronize: true,
                    entities: [User]
                }),
                AuthModule,
                UserModule
            ]
        }).compile();

        userService = moduleFixture.get<UserService>(UserService);
        authService = moduleFixture.get<AuthService>(AuthService);
        userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        await app.init();
    });

    afterEach(async () => {
        await userRepository.clear();
        await getConnection().close();
    });

    describe('login mutation', () => {
        it('authenticates a user with a valid email and password', async () => {
            await userService.create(oliver);
            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({
                    query: loginOp,
                    variables: { loginInput: { email: oliver.email, password: oliver.password } }
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
                    variables: {
                        loginInput: { email: 'unknown-email@qc.com', password: oliver.password }
                    }
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
                    variables: { loginInput: { email: oliver.email, password: 'wrong-password' } }
                })
                .expect(({ body }) => {
                    expect(body.data).toBeNull();
                    expect(body.errors).toHaveLength(1);
                    expect(body.errors[0].message).toBe('Unauthorized');
                    expect(body.errors[0].extensions.response.statusCode).toBe(401);
                });
        });
    });

    describe('logout mutation', () => {
        it('clears the refresh token cookie', async () => {
            const ollie = await userService.create(oliver);
            const refreshToken = authService.generateRefreshToken(ollie);

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Cookie', [`qid=${refreshToken}`])
                .send({
                    query: logoutOp,
                    variables: {}
                })
                .expect((response) => {
                    const cookies = response.headers['set-cookie'][0].split(';');

                    const [refreshTokenCookieKey, refreshTokenCookieValue] = cookies
                        .map((cookie: string) => {
                            return cookie.split('=');
                        })
                        .find((parts: string[]) => parts[0] === 'qid');

                    expect(refreshTokenCookieKey).toBe('qid');
                    expect(refreshTokenCookieValue).toBe('');

                    const { logout } = response.body.data;
                    expect(logout).toBe(true);
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
                    query: refreshAccessTokenOp,
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
                    query: refreshAccessTokenOp,
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
                    query: refreshAccessTokenOp,
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
                    query: refreshAccessTokenOp,
                    variables: {}
                })
                .expect(({ body }) => {
                    const { accessToken } = body.data.refreshAccessToken;
                    expect(accessToken).toBeNull();
                });
        });
    });
});
