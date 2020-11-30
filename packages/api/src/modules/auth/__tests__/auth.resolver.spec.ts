import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthResolver } from '../auth.resolver';
import { UserModule } from '../../user/user.module';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserDto } from '../../user/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';

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

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                UserModule,
                JwtModule.register({
                    secret: 'tempjwtsecret' // TODO: move this 'secret' to a config env file
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
            const expectedToken = 'randomToken123456';
            const ollie = userService.create(oliver);

            jest.spyOn(authService, 'authenticateUser').mockResolvedValue(ollie);
            jest.spyOn(authService, 'generateAccessToken').mockResolvedValue(expectedToken);

            const result = await authResolver.login(oliver.email, oliver.password);

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: expectedToken
                })
            );
        });

        it('returns an Unauthorized exception if user is not authenticated', async () => {
            jest.spyOn(authService, 'authenticateUser').mockResolvedValue(null);

            const error = (await authResolver.login(
                'unknown-user@example.com',
                'secret'
            )) as UnauthorizedException;

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
});
