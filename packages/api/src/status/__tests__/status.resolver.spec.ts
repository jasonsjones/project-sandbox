import { Test, TestingModule } from '@nestjs/testing';
import { StatusResolver } from '../status.resolver';
import { StatusService } from '../status.service';
import constants from '../constants';

describe('StatusResolver', () => {
    let resolver: StatusResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StatusResolver, StatusService]
        }).compile();

        resolver = module.get<StatusResolver>(StatusResolver);
    });

    it('is defined', () => {
        expect(resolver).toBeDefined();
    });

    it('has staus() method', () => {
        expect(resolver.getStatus()).toBe(constants.STATUS_MESSAGE);
    });
});
