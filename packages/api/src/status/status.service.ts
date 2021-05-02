import { Injectable, Logger } from '@nestjs/common';
import constants from './constants';

@Injectable()
export class StatusService {
    private readonly logger = new Logger(StatusService.name);

    getMessage(): string {
        this.logger.log('Fetching status message');
        return constants.STATUS_MESSAGE;
    }
}
