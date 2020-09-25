import { DataSource } from 'apollo-datasource';

class StatusService extends DataSource {
    constructor() {
        super();
    }

    getStatusMessage(): string {
        return 'Graphql api is working';
    }
}

export default StatusService;
