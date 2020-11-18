import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { CreateUserDto } from '../../user/create-user.dto';
import { UserModule } from '../../user/user.module';

const oliver: CreateUserDto = {
    firstName: 'Oliver',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: 'secretpassword'
};

describe('Auth service', () => {
    let authService: AuthService;
    let userService: UserService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [UserModule],
            providers: [AuthService]
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        userService = moduleRef.get<UserService>(UserService);
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
});
