import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/modules/user/create-user.dto';
import { UserService } from '../src/modules/user/user.service';

const oliver: CreateUserDto = {
    firstName: 'Ollie',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: '123456'
};

const LoginOp = `
mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        accessToken
    }
}`;

describe('Auth resolver (e2e)', () => {
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

    describe('login mutation', () => {
        it('authenticates a user with a valid email and password', async () => {
            await userService.create(oliver);
            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({
                    query: LoginOp,
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
                    query: LoginOp,
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
                    query: LoginOp,
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
});
