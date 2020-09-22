import { DataSource } from 'apollo-datasource';

class StatusDataSource extends DataSource {
    constructor() {
        super();
    }

    getStatusMessage(): string {
        return 'Graphql api is working';
    }
}

export default StatusDataSource;
