import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UserService } from '../user.service';
import { barry, mockSavedBarry, mockSavedOliver, oliver } from './user.data';

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

describe('User service', () => {
    let userService: UserService;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: UserRepositoryFake
                }
            ]
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
        userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('createUser()', () => {
        const mockCreateUser = User.of({});

        it('calls the repository with the correct arguments', async () => {
            const userRepositoryCreateSpy = jest
                .spyOn(userRepository, 'create')
                .mockReturnValue(mockCreateUser);

            const userRepositorySaveSpy = jest
                .spyOn(userRepository, 'save')
                .mockResolvedValue(mockSavedOliver);

            await userService.create(oliver);

            expect(userRepositoryCreateSpy).toHaveBeenCalled();
            expect(userRepositorySaveSpy).toHaveBeenCalled();

            expect(userRepositorySaveSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    firstName: oliver.firstName,
                    lastName: oliver.lastName,
                    email: oliver.email,
                    password: expect.any(String),
                    refreshTokenId: 0
                })
            );
        });

        it("hashes the user's password before saving", async () => {
            jest.spyOn(userRepository, 'create').mockReturnValue(mockCreateUser);

            const userRepositorySaveSpy = jest
                .spyOn(userRepository, 'save')
                .mockResolvedValue(mockSavedOliver);

            await userService.create(oliver);

            const savedPwd = userRepositorySaveSpy.mock.calls[0][0].password;
            expect(savedPwd).not.toEqual(oliver.password);
            expect(savedPwd).toMatch(/^\$2*/);
        });
    });

    describe('getAllUsers()', () => {
        it('calls the repository with no arguments', async () => {
            const userRepositoryFindSpy = jest
                .spyOn(userRepository, 'find')
                .mockResolvedValue([mockSavedBarry]);

            await userService.getAllUsers();

            expect(userRepositoryFindSpy).toHaveBeenCalledWith();
        });
    });

    describe('findByEmail()', () => {
        it('calls the repository with the correct arguments', async () => {
            const userRepositoryFindOneSpy = jest
                .spyOn(userRepository, 'findOne')
                .mockResolvedValue(mockSavedBarry);

            await userService.findByEmail(barry.email);

            expect(userRepositoryFindOneSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        email: barry.email
                    })
                })
            );
        });
    });

    describe('findById()', () => {
        it('calls the repository with the correct arguments', async () => {
            const userRepositoryFindOneSpy = jest
                .spyOn(userRepository, 'findOne')
                .mockResolvedValue(mockSavedOliver);
            await userService.findById(mockSavedBarry.id);

            expect(userRepositoryFindOneSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        id: mockSavedBarry.id
                    })
                })
            );
        });
    });
});
