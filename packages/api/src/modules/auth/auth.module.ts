import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: 'tempjwtsecret' // TODO: move this 'secret' to a config env file
        })
    ],
    providers: [AuthService, AuthResolver]
})
export class AuthModule {}
