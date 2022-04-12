import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import fs from 'fs';
import { FileUpload, graphqlUploadExpress } from 'graphql-upload';
import request from 'supertest';
import { getConnection, Repository } from 'typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { AvatarModule } from '../src/avatar/avatar.module';
import { AvatarResolver } from '../src/avatar/avatar.resolver';
import { CreateUserDto } from '../src/user/create-user.dto';
import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';
import { UserService } from '../src/user/user.service';
import { avatarQuery, avatarUploadOp } from './utils/constants';

function generateVariableMap(keyName: string) {
    return {
        [keyName]: [`variables.${keyName}`]
    };
}

const constants = {
    OPERATIONS: 'operations',
    MAP: 'map'
};

const barry: CreateUserDto = {
    firstName: 'Barry',
    lastName: 'Allen',
    email: 'barry@starlabs.com',
    password: 'secretpassword'
};

describe('Avatar resolver (e2e)', () => {
    let app: INestApplication;
    let authService: AuthService;
    let userService: UserService;
    let avatarResolver: AvatarResolver;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AuthModule,
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
                AvatarModule,
                UserModule
            ]
        }).compile();

        authService = moduleFixture.get<AuthService>(AuthService);
        userService = moduleFixture.get<UserService>(UserService);
        avatarResolver = moduleFixture.get<AvatarResolver>(AvatarResolver);
        userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

        app = moduleFixture.createNestApplication();
        app.use(graphqlUploadExpress());
        await app.init();
    });

    afterEach(async () => {
        await userRepository.clear();
        await getConnection().close();
    });

    describe('upload avatar mutation', () => {
        it('uploads png image', async () => {
            const user = await userService.create(barry);
            const accessToken = authService.generateAccessToken(user);

            const testFile = `${__dirname}/../avatars/default/avatar.png`;

            const variables = {
                userId: user.id,
                image: null
            };

            const variableMap = generateVariableMap('image');

            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'multipart/form-data')
                .set('Authorization', `Bearer ${accessToken}`)
                .field(constants.OPERATIONS, JSON.stringify({ query: avatarUploadOp, variables }))
                .field(constants.MAP, JSON.stringify(variableMap))
                .attach(Object.keys(variableMap)[0], testFile)
                .expect((res) => {
                    expect(res.body.data.avatarUpload).toBe(true);
                });
        });
    });

    describe('avatar query', () => {
        let user: User;

        beforeEach(async () => {
            user = await userService.create(barry);
            const req = {
                user: {
                    id: user.id
                }
            } as Request;
            const res = {} as Response;
            const testFile = `${__dirname}/../avatars/default/avatar.png`;
            const stream = fs.createReadStream(testFile);
            const image: Promise<FileUpload> = Promise.resolve({
                createReadStream: () => stream,
                filename: 'avatar.png',
                mimetype: 'image/png',
                encoding: 'buffer'
            });

            await avatarResolver.avatarUpload({ userId: user.id, image }, { req, res });
        });

        it("fetches a user's avatar based on key", async () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .send({ query: avatarQuery, variables: { key: user.id } })
                .expect(({ body }) => {
                    const { avatar } = body.data;
                    const [dataPreamble, content] = avatar.split(' ');
                    expect(dataPreamble).toEqual('data:image/png;base64,');
                    expect(content.length).toBeGreaterThan(100);
                });
        });
    });
});
