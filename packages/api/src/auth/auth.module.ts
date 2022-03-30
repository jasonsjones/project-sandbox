import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { SFDCAuthService } from './auth.sfdc.service';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
        ConfigModule,
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET')
            }),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService, SFDCAuthService, AuthResolver, LocalStrategy],
    exports: [AuthService, SFDCAuthService]
})
export class AuthModule {}
