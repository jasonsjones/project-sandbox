import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from '../status.service';
import constants from '../constants';

describe('StatusService', () => {
    let service: StatusService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StatusService]
        }).compile();

        service = module.get<StatusService>(StatusService);
    });

    it('is defined', () => {
        expect(service).toBeDefined();
    });

    it('getMessage() returns a string', () => {
        expect(service.getMessage()).toBe(constants.STATUS_MESSAGE);
    });
});
