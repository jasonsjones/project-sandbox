import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { mocked } from 'ts-jest/utils';
import { getToken } from 'sf-jwt-token';
import { SFDCAuthService } from '../auth.sfdc.service';
import { TokenOutput } from 'sf-jwt-token/dist/Interfaces';
import jsforce from 'jsforce';

jest.mock('sf-jwt-token');
jest.mock('jsforce');

const mockToken: TokenOutput = {
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
    let service: SFDCAuthService;
    beforeEach(async () => {
        jest.clearAllMocks();

        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [SFDCAuthService]
        }).compile();

        service = moduleRef.get<SFDCAuthService>(SFDCAuthService);
    });

    describe('getToken()', () => {
        it('gets SFDC access token info for GS0 org', async () => {
            mocked(getToken).mockImplementationOnce(() => {
                return Promise.resolve(mockToken);
            });

            const result = await service.getTokenInfo();
            expect(result).toMatchObject(mockToken);
        });

        it('caches access token info', async () => {
            const mockedGetToken = mocked(getToken).mockImplementationOnce(() => {
                return Promise.resolve(mockToken);
            });

            // make multiple calls
            await service.getTokenInfo();
            await service.getTokenInfo();
            await service.getTokenInfo();

            expect(mockedGetToken).toHaveBeenCalledTimes(1);
        });
    });

    describe('getConnection()', () => {
        const mockConnection = {} as jsforce.Connection;

        it('returns a jsforce connection object', async () => {
            mocked(getToken).mockImplementationOnce(() => {
                return Promise.resolve(mockToken);
            });

            const mockConstructor = mocked(jsforce.Connection).mockImplementationOnce(
                () => mockConnection
            );

            const result = await service.getConnection();

            expect(result).toMatchObject(mockConnection);
            expect(mockConstructor).toHaveBeenCalledTimes(1);
        });

        it('caches a jsforce connection object after first call', async () => {
            mocked(getToken).mockImplementationOnce(() => {
                return Promise.resolve(mockToken);
            });

            const mockConstructor = mocked(jsforce.Connection).mockImplementationOnce(
                () => mockConnection
            );

            // make multiple calls
            await service.getConnection();
            await service.getConnection();
            await service.getConnection();

            expect(mockConstructor).toHaveBeenCalledTimes(1);
        });
    });
});
