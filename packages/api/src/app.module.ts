import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerMiddleware } from './common/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './modules/status/status.module';
import { UserModule } from './modules/user/user.module';
import { AvatarModule } from './modules/avatar/avatar.module';
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
            context: ({ req, res }) => ({ req, res })
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
        if (process.env.NODE_ENV !== 'test') {
            consumer.apply(AuthMiddleware, LoggerMiddleware).forRoutes('*');
        } else {
            consumer.apply(AuthMiddleware).forRoutes('*');
        }
    }
}
