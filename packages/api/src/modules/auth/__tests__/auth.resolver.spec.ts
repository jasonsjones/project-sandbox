import { Request, Response } from 'express';
import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthResolver } from '../auth.resolver';
import { UserModule } from '../../user/user.module';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserDto } from '../../user/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const oliver: CreateUserDto = {
    firstName: 'Ollie',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: '123456'
};

describe('Auth resolver', () => {
    let authService: AuthService;
    let userService: UserService;
    let authResolver: AuthResolver;

    const fakeToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule,
                UserModule,
                JwtModule.register({
                    secret: 'jwtsecretfortest'
                })
            ],
            providers: [AuthResolver, AuthService]
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        userService = moduleRef.get<UserService>(UserService);
        authResolver = moduleRef.get<AuthResolver>(AuthResolver);
    });

    describe('login mutation', () => {
        it('returns an access token if user is authenticated', async () => {
            const res = {} as Response;
            res.cookie = jest.fn();

            const req = {} as Request;

            const ollie = await userService.create(oliver);

            jest.spyOn(authService, 'authenticateUser').mockResolvedValue(ollie);
            jest.spyOn(authService, 'generateAccessToken').mockImplementation(() => fakeToken);

            const result = await authResolver.login(oliver.email, oliver.password, {
                req,
                res
            });

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: fakeToken
                })
            );
            expect(res.cookie).toHaveBeenCalled();
        });

        it('returns an Unauthorized exception if user is not authenticated', async () => {
            const res = {} as Response;
            res.cookie = jest.fn();

            const req = {} as Request;
            jest.spyOn(authService, 'authenticateUser').mockResolvedValue(null);

            const error = (await authResolver.login('unknown-user@example.com', 'orion', {
                req,
                res
            })) as UnauthorizedException;

            expect(error instanceof UnauthorizedException).toBe(true);
            expect(error.getStatus()).toBe(401);
            expect(error.getResponse()).toEqual(
                expect.objectContaining({
                    message: 'Unauthorized',
                    statusCode: 401
                })
            );
        });
    });

    describe('refreshAccessToken query', () => {
        it('refreshes the access token when presented with a valid refresh token', async () => {
            const res = {} as Response;
            res.cookie = jest.fn();

            const req = {} as Request;
            req.cookies = {
                qid: fakeToken
            };

            const tokenPayload = {
                sub: '05fc4d47-b88c-4494-86e9-b64d748e1df6',
                email: 'oliver@qc.com',
                tokenId: 0,
                iat: 1516239032
            };

            const ollie = await userService.create(oliver);
            jest.spyOn(authService, 'verifyToken').mockImplementation(() => tokenPayload);
            jest.spyOn(userService, 'findByEmail').mockResolvedValue(ollie);
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
            const res = {} as Response;
            const req = {} as Request;
            req.cookies = {
                qid: undefined
            };

            const result = await authResolver.refreshAccessToken({ req, res });

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: null
                })
            );
        });

        it('returns null access token and clears cookie if refresh token id does not match', async () => {
            const res = {} as Response;
            res.clearCookie = jest.fn();

            const req = {} as Request;
            req.cookies = {
                qid: fakeToken
            };

            const tokenPayload = {
                sub: '05fc4d47-b88c-4494-86e9-b64d748e1df6',
                email: 'oliver@qc.com',
                tokenId: 1,
                iat: 1516239032
            };

            const ollie = await userService.create(oliver);
            ollie.refreshTokenId = 2;
            jest.spyOn(authService, 'verifyToken').mockImplementation(() => tokenPayload);
            jest.spyOn(userService, 'findByEmail').mockResolvedValue(ollie);

            const result = await authResolver.refreshAccessToken({ req, res });

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: null
                })
            );

            expect(res.clearCookie).toHaveBeenCalledWith('qid');
        });

        it('returns null access token and clears cookie if refresh token is expired', async () => {
            const res = {} as Response;
            res.clearCookie = jest.fn();

            const req = {} as Request;
            req.cookies = {
                qid: fakeToken
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
            const res = {} as Response;
            res.clearCookie = jest.fn();

            const req = {} as Request;
            req.cookies = {
                qid: fakeToken
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
