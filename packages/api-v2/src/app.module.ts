import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './modules/status/status.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        GraphQLModule.forRoot({ autoSchemaFile: 'src/schema.gql' }),
        StatusModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
