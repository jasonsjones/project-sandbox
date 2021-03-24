import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { getToken } from 'sf-jwt-token';
import { TokenOutput } from 'sf-jwt-token/dist/Interfaces';
import jsforce from 'jsforce';

@Injectable()
export class SFDCAuthService {
    static privateKey = fs.readFileSync(__dirname + '/../../../.certs/server.key').toString('utf8');
    token: TokenOutput;
    connection: jsforce.Connection;

    private async fetchTokenInfo(): Promise<TokenOutput> {
        const clientId =
            process.env.NODE_ENV === 'production'
                ? process.env.SFDC_PROD_CLIENT_ID
                : process.env.SFDC_LOCAL_CLIENT_ID;

        try {
            this.token = await getToken({
                iss: clientId,
                sub: process.env.SFDC_USERNAME,
                aud: process.env.SFDC_AUDIENCE,
                privateKey: SFDCAuthService.privateKey
            });
            return this.token;
        } catch (e) {
            console.log(e);
        }
    }

    async getTokenInfo(): Promise<TokenOutput> {
        if (!this.token) {
            return await this.fetchTokenInfo();
        }
        return this.token;
    }

    async getConnection(): Promise<jsforce.Connection> {
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
