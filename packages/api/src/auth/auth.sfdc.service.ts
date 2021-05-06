import { Injectable, Logger } from '@nestjs/common';
import { getToken } from 'sf-jwt-token';
import { TokenOutput } from 'sf-jwt-token/dist/Interfaces';
import jsforce from 'jsforce';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SFDCAuthService {
    private readonly logger = new Logger(SFDCAuthService.name);

    private privateKey: string;
    private token: TokenOutput;
    private connection: jsforce.Connection;

    constructor(private configService: ConfigService) {
        this.privateKey = configService.get<string>('SFDC_SERVER_PRIVATE_KEY') || '';
    }

    private async fetchTokenInfo(): Promise<TokenOutput> {
        const env = this.configService.get<string>('NODE_ENV');
        const prodClientId = this.configService.get<string>('SFDC_PROD_CLIENT_ID');
        const localClientId = this.configService.get<string>('SFDC_LOCAL_CLIENT_ID');

        const clientId = env === 'production' ? prodClientId : localClientId;

        try {
            this.token = await getToken({
                iss: clientId,
                sub: this.configService.get<string>('SFDC_USERNAME'),
                aud: this.configService.get<string>('SFDC_AUDIENCE'),
                privateKey: this.privateKey
            });
            return this.token;
        } catch (err) {
            this.logger.error(`Error in sf-jwt-token "getToken()": ${err.message}`);
        }
    }

    async getTokenInfo(): Promise<TokenOutput> {
        this.logger.log('Fetching SFDC token info');
        if (!this.token) {
            return await this.fetchTokenInfo();
        }
        return this.token;
    }

    async getConnection(): Promise<jsforce.Connection> {
        this.logger.log('Getting SFDC (jsforce) connection');
        const tokenInfo = await this.getTokenInfo();
        if (!this.connection) {
            this.connection = new jsforce.Connection({
                instanceUrl: tokenInfo.instance_url,
                accessToken: tokenInfo.access_token
            });
        }
        return this.connection;
    }
}
