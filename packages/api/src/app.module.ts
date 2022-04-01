import {
    Logger,
    MiddlewareConsumer,
    Module,
    NestModule,
    OnApplicationBootstrap
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { LoggerMiddleware } from './common/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './status/status.module';
import { UserModule } from './user/user.module';
import { AvatarModule } from './avatar/avatar.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from '../ormconfig';
import { Connection } from 'typeorm';

@Module({
    imports: [
        ConfigModule.forRoot(),
        GraphQLModule.forRoot({
            autoSchemaFile: 'src/schema.gql',
            cors: {
                origin: ['http://localhost:4200'],
                credentials: true
            },
            context: ({ req, res }) => ({ req, res })
        }),
        TypeOrmModule.forRoot(dbConfig),
        AuthModule,
        AvatarModule,
        StatusModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule, OnApplicationBootstrap {
    private readonly logger = new Logger(AppModule.name);

    constructor(private connection: Connection) {}

    configure(consumer: MiddlewareConsumer) {
        // utilize graphql-upload middleware to handle uploads; this is required
        // to address lagging dependency versions which caused a
        // `RangeError: Maximum call stack size exceeded` (Issue #78)
        consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }

    async onApplicationBootstrap() {
        this.logger.log('App module bootstrapping complete');
        try {
            this.logger.log('Running db migrations...');
            await this.connection.runMigrations();
        } catch (err) {
            this.logger.error(err);
        }
    }
}
