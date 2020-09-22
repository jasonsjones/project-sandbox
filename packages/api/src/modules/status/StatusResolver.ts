import { Ctx, Query, Resolver } from 'type-graphql';
import StatusDataSource from './StatusDataSource';

interface AppDataSource {
    statusDataSource: StatusDataSource;
}
interface AppContext {
    dataSources: AppDataSource;
}

@Resolver()
class StatusResolver {
    @Query(() => String)
    status(@Ctx() ctx: AppContext): string {
        return ctx.dataSources.statusDataSource.getStatusMessage();
    }
}

export default StatusResolver;
