import { Request } from 'express';
import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthResolver } from '../auth.resolver';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserDto } from '../../user/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { mockSavedOliver } from '../../user/__tests__/user.data';

const oliver: CreateUserDto = {
    firstName: 'Ollie',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: '123456'
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

describe('Auth resolver', () => {
    let authService: AuthService;
    let userService: UserService;
    let authResolver: AuthResolver;

    const fakeToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'jwtsecretfortest'
                })
            ],
            providers: [
                AuthResolver,
                AuthService,
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: UserRepositoryFake
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === 'JWT_SECRET') {
                                return 'jwtsecretfortest';
                            }
                            return null;
                        })
                    }
                }
            ]
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        userService = moduleRef.get<UserService>(UserService);
        authResolver = moduleRef.get<AuthResolver>(AuthResolver);
    });

    describe('login mutation', () => {
        it('returns an access token if user is authenticated', async () => {
            const req = {} as Request;
            const res: any = {
                cookie: jest.fn()
            };

            jest.spyOn(authService, 'authenticateUser').mockResolvedValue(mockSavedOliver);
            jest.spyOn(authService, 'generateAccessToken').mockReturnValue(fakeToken);
            jest.spyOn(authService, 'generateRefreshToken').mockReturnValue(fakeToken);

            const result = await authResolver.login(
                { email: oliver.email, password: oliver.password },
                {
                    req,
                    res
                }
            );

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: fakeToken
                })
            );

            expect(res.cookie).toHaveBeenCalledWith('qid', fakeToken, { httpOnly: true });
        });
    });

    describe('logout mutation', () => {
        it('clears the refresh token cookie (qid)', async () => {
            const req = {} as Request;
            const res: any = {
                cookie: jest.fn(),
                clearCookie: jest.fn()
            };

            const result = authResolver.logout({ req, res });

            expect(result).toBe(true);
            expect(res.clearCookie).toHaveBeenCalledWith('qid');
        });
    });

    describe('refreshAccessToken mutation', () => {
        it('refreshes the access token when presented with a valid refresh token', async () => {
            const req: any = {
                cookies: {
                    qid: fakeToken
                }
            };

            const res: any = {
                cookie: jest.fn(),
                clearCookie: jest.fn()
            };

            const tokenPayload = {
                sub: '05fc4d47-b88c-4494-86e9-b64d748e1df6',
                email: 'oliver@qc.com',
                tokenId: 0,
                iat: 1516239032
            };

            // const ollie = await userService.create(oliver);
            jest.spyOn(authService, 'verifyToken').mockImplementation(() => tokenPayload);
            jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockSavedOliver);
            jest.spyOn(authService, 'generateAccessToken').mockImplementation(() => fakeToken);
            jest.spyOn(authService, 'generateRefreshToken').mockImplementation(() => fakeToken);

            const result = await authResolver.refreshAccessToken({ req, res });

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: fakeToken
                })
            );

            expect(res.cookie).toHaveBeenCalledWith('qid', fakeToken, { httpOnly: true });
        });

        it('returns null access token if refresh token is undefined', async () => {
            const req: any = {
                cookies: {
                    qid: undefined
                }
            };

            const res: any = {
                cookie: jest.fn(),
                clearCookie: jest.fn()
            };

            const result = await authResolver.refreshAccessToken({ req, res });

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: null
                })
            );
        });

        it('returns null access token and clears cookie if refresh token id does not match', async () => {
            const req: any = {
                cookies: {
                    qid: fakeToken
                }
            };

            const res: any = {
                cookie: jest.fn(),
                clearCookie: jest.fn()
            };

            const tokenPayload = {
                sub: '05fc4d47-b88c-4494-86e9-b64d748e1df6',
                email: 'oliver@qc.com',
                tokenId: 1,
                iat: 1516239032
            };

            // const ollie = await userService.create(oliver);
            // ollie.refreshTokenId = 2;
            jest.spyOn(authService, 'verifyToken').mockImplementation(() => tokenPayload);
            // jest.spyOn(userService, 'findByEmail').mockResolvedValue(ollie);
            jest.spyOn(userService, 'findByEmail').mockResolvedValue(
                User.of({
                    ...mockSavedOliver,
                    refreshTokenId: 2
                })
            );

            const result = await authResolver.refreshAccessToken({ req, res });

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: null
                })
            );

            expect(res.clearCookie).toHaveBeenCalledWith('qid');
        });

        it('returns null access token and clears cookie if refresh token is expired', async () => {
            const req: any = {
                cookies: {
                    qid: fakeToken
                }
            };

            const res: any = {
                cookie: jest.fn(),
                clearCookie: jest.fn()
            };

            const twoHoursAgo = new Date();
            twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

            jest.spyOn(authService, 'verifyToken').mockImplementation(() => {
                throw new TokenExpiredError('jwt expired', twoHoursAgo);
            });

            const result = await authResolver.refreshAccessToken({ req, res });

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: null
                })
            );

            expect(res.clearCookie).toHaveBeenCalledWith('qid');
        });

        it('returns null access token and clears cookie if refresh token is otherwize invalid', async () => {
            const req: any = {
                cookies: {
                    qid: fakeToken
                }
            };

            const res: any = {
                cookie: jest.fn(),
                clearCookie: jest.fn()
            };

            jest.spyOn(authService, 'verifyToken').mockImplementation(() => {
                throw new JsonWebTokenError('jwt malformed');
            });

            const result = await authResolver.refreshAccessToken({ req, res });

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: null
                })
            );

            expect(res.clearCookie).toHaveBeenCalledWith('qid');
        });
    });
});
