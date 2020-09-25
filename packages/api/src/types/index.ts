import StatusService from '../modules/status/StatusService';

interface AppDataSource {
    statusService: StatusService;
}

export interface AppContext {
    dataSources: AppDataSource;
}
