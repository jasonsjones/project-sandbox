import { Injectable } from '@nestjs/common';
import constants from './constants';

@Injectable()
export class StatusService {
    getMessage(): string {
        return constants.STATUS_MESSAGE;
    }
}
