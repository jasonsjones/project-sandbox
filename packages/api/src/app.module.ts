import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { LoggerMiddleware } from './common/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './status/status.module';
import { UserModule } from './modules/user/user.module';
import { AvatarModule } from './avatar/avatar.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './common/auth.middleware';

@Module({
    imports: [
        ConfigModule.forRoot(),
        GraphQLModule.forRoot({
            autoSchemaFile: 'src/schema.gql',
            cors: {
                origin: ['http://localhost:4200'],
                credentials: true
            },
            context: ({ req, res }) => ({ req, res }),
            uploads: false // disable built-in upload handling
        }),
        AuthModule,
        AvatarModule,
        StatusModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // utilize graphql-upload middleware to handle uploads; this is required
        // to address lagging dependency versions which caused a
        // `RangeError: Maximum call stack size exceeded` (Issue #78)
        consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
        consumer.apply(AuthMiddleware).forRoutes('*');

        if (process.env.NODE_ENV !== 'test') {
            consumer.apply(LoggerMiddleware).forRoutes('*');
        }
    }
}
