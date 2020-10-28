import { Query, Resolver } from '@nestjs/graphql';
import { StatusService } from './status.service';

@Resolver('Status')
export class StatusResolver {
    constructor(private readonly statusService: StatusService) {}

    @Query((returns) => String)
    status(): string {
        return this.statusService.getMessage();
    }
}
