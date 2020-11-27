import { Query, Resolver } from '@nestjs/graphql';
import { StatusService } from './status.service';

@Resolver('Status')
export class StatusResolver {
    constructor(private readonly statusService: StatusService) {}

    @Query((_returns) => String, { name: 'status' })
    getStatus(): string {
        return this.statusService.getMessage();
    }
}
