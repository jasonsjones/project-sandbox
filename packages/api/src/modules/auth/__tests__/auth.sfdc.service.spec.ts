import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { mocked } from 'ts-jest/utils';
import { getToken } from 'sf-jwt-token';
import { SFDCAuthService } from '../auth.sfdc.service';
import { TokenOutput } from 'sf-jwt-token/dist/Interfaces';

jest.mock('sf-jwt-token');

const mokenToken: TokenOutput = {
    access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
        'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    scope: 'full',
    instance_url: 'https://login.salesforce.com',
    id: 'admin@sandbox.com',
    token_type: 'Bearer'
};

describe('SFDC auth service', () => {
    let tokenManager: SFDCAuthService;
    beforeEach(async () => {
        jest.clearAllMocks();

        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [SFDCAuthService]
        }).compile();

        tokenManager = moduleRef.get<SFDCAuthService>(SFDCAuthService);
    });

    it('gets SFDC access token info for GS0 org', async () => {
        mocked(getToken).mockImplementationOnce(() => {
            return Promise.resolve(mokenToken);
        });

        const result = await tokenManager.getTokenInfo();
        expect(result).toMatchObject(mokenToken);
    });

    it('caches access token info', async () => {
        const mockedGetToken = mocked(getToken).mockImplementationOnce(() => {
            return Promise.resolve(mokenToken);
        });

        // make multiple calls
        await tokenManager.getTokenInfo();
        await tokenManager.getTokenInfo();

        expect(mockedGetToken).toHaveBeenCalledTimes(1);
    });
});
