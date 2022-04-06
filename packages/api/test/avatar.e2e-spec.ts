import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { graphqlUploadExpress } from 'graphql-upload';
import request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { AvatarModule } from '../src/avatar/avatar.module';
import { CreateUserDto } from '../src/user/create-user.dto';
import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';
import { UserService } from '../src/user/user.service';
import { avatarUploadOp } from './utils/constants';

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
        app = moduleFixture.createNestApplication();
        app.use(graphqlUploadExpress());
        await app.init();
    });

    describe('upload avatar mutation', () => {
        it('uploads png image', async () => {
            const user = await userService.create(barry);
            const accessToken = authService.generateAccessToken(user);

            const testFile = `${__dirname}/../avatars/default/avatar.png`;

            const variables = {
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
});
