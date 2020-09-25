import { Ctx, Query, Resolver } from 'type-graphql';
import { AppContext } from '../../types';

@Resolver()
class StatusResolver {
    @Query(() => String)
    status(@Ctx() { dataSources }: AppContext): string {
        return dataSources.statusService.getStatusMessage();
    }
}

export default StatusResolver;
