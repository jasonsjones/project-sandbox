import StatusService from '../modules/status/StatusService';
import UserService from '../modules/user/UserService';

interface AppDataSource {
    statusService: StatusService;
    userService: UserService;
}

export interface AppContext {
    dataSources: AppDataSource;
}
