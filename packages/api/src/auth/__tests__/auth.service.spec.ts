import { Test } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { CreateUserDto } from '../../user/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { mockSavedOliver } from '../../user/__tests__/user.data';

const oliver: CreateUserDto = {
    firstName: 'Oliver',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: 'secretpassword'
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
    public async findOneOrFail(): Promise<void> {
        /* empty */
    }
}

describe('Auth service', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'jwtsecretfortest'
                })
            ],
            providers: [
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
        jwtService = moduleRef.get<JwtService>(JwtService);
    });

    describe('authenticateUser()', () => {
        it('authenticates a user given a valid password', async () => {
            const hashedPwd = await bcrypt.hash(mockSavedOliver.password, 12);
            jest.spyOn(userService, 'findByEmail').mockResolvedValue({
                ...mockSavedOliver,
                password: hashedPwd
            });

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
            const hashedPwd = await bcrypt.hash(mockSavedOliver.password, 12);
            jest.spyOn(userService, 'findByEmail').mockResolvedValue({
                ...mockSavedOliver,
                password: hashedPwd
            });
            const result = await authService.authenticateUser(oliver.email, 'wrong-password');
            expect(result).toBeNull();
        });
    });

    describe('generateAccessToken()', () => {
        it('calls the jwt service with the correct arguments ', async () => {
            const jwtSignSpy = jest.spyOn(jwtService, 'sign');

            authService.generateAccessToken(mockSavedOliver);

            expect(jwtSignSpy.mock.calls[0][0]).toEqual(
                expect.objectContaining({
                    sub: mockSavedOliver.id,
                    email: mockSavedOliver.email
                })
            );
            expect(jwtSignSpy.mock.calls[0][1]).toEqual(
                expect.objectContaining({
                    expiresIn: '10m'
                })
            );
        });
    });

    describe('generateRefreshToken()', () => {
        it('calls the jwt service with the correct arguments', async () => {
            const jwtSignSpy = jest.spyOn(jwtService, 'sign');

            authService.generateRefreshToken(mockSavedOliver);

            expect(jwtSignSpy.mock.calls[0][0]).toEqual(
                expect.objectContaining({
                    sub: mockSavedOliver.id,
                    email: mockSavedOliver.email
                })
            );
            expect(jwtSignSpy.mock.calls[0][1]).toEqual(
                expect.objectContaining({
                    expiresIn: '14d'
                })
            );
        });
    });

    describe('verifyToken()', () => {
        it('calls the jwt service with the correct arguments', () => {
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

            const result = {
                sub: '234590-877673-787663',
                email: oliver.email,
                tokenId: 0,
                iat: 1516239022
            };
            const jwtVerifySpy = jest.spyOn(jwtService, 'verify').mockReturnValue(result);

            authService.verifyToken(token);

            expect(jwtVerifySpy.mock.calls[0][0]).toBe(token);
            expect(jwtVerifySpy.mock.calls[0][1]).toEqual(
                expect.objectContaining({
                    secret: 'jwtsecretfortest'
                })
            );
        });
    });
});
