import { Logger } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { StatusService } from './status.service';

@Resolver('Status')
export class StatusResolver {
    private readonly logger = new Logger(StatusResolver.name);

    constructor(private readonly statusService: StatusService) {}

    @Query((_returns) => String, { name: 'status' })
    getStatus(): string {
        this.logger.log('getStatus query');
        return this.statusService.getMessage();
    }
}
