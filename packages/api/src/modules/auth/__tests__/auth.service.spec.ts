import { Test } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { CreateUserDto } from '../../user/create-user.dto';
import { UserModule } from '../../user/user.module';
import { ConfigModule } from '@nestjs/config';

const oliver: CreateUserDto = {
    firstName: 'Oliver',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: 'secretpassword'
};

describe('Auth service', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule,
                UserModule,
                JwtModule.register({
                    secret: 'jwtsecretfortest'
                })
            ],
            providers: [AuthService]
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        userService = moduleRef.get<UserService>(UserService);
        jwtService = moduleRef.get<JwtService>(JwtService);
    });

    describe('authenticateUser()', () => {
        it('authenticates a user given a valid password', async () => {
            await userService.create(oliver);
            const result = await authService.authenticateUser(oliver.email, oliver.password);
            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    firstName: oliver.firstName,
                    lastName: oliver.lastName,
                    email: oliver.email,
                    password: expect.any(String)
                })
            );
        });

        it('returns null if an invalid password', async () => {
            await userService.create(oliver);
            const result = await authService.authenticateUser(oliver.email, 'wrong-password');
            expect(result).toBeNull();
        });
    });

    describe('generateAccessToken()', () => {
        it('generates an access token string', async () => {
            const ollie = await userService.create(oliver);
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

            jest.spyOn(jwtService, 'sign').mockImplementation(() => token);
            expect(authService.generateAccessToken(ollie)).toBe(token);
        });
    });

    describe('generateRefreshToken()', () => {
        it('generates a refresh token string', async () => {
            const ollie = await userService.create(oliver);
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

            jest.spyOn(jwtService, 'sign').mockImplementation(() => token);
            expect(authService.generateRefreshToken(ollie)).toBe(token);
        });
    });

    describe('verifyToken()', () => {
        it('verifies a valid jwt', () => {
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

            const result = {
                sub: '234590-877673-787663',
                email: oliver.email,
                tokenId: 0,
                iat: 1516239022
            };
            jest.spyOn(jwtService, 'verify').mockImplementation(() => result);
            expect(authService.verifyToken(token)).toBe(result);
        });
    });
});
