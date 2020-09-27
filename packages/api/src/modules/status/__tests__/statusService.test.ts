import StatusService from '../StatusService';

describe('Status service', () => {
    let statusService: StatusService;
    beforeEach(() => {
        statusService = new StatusService();
    });

    it('returns a simple status message', () => {
        expect(statusService.getStatusMessage()).toEqual(expect.any(String));
    });
});
