import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './modules/status/status.module';

@Module({
    imports: [GraphQLModule.forRoot({ autoSchemaFile: 'src/schema.gql' }), StatusModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
