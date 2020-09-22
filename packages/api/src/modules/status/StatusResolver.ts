import { Query, Resolver } from 'type-graphql';

@Resolver()
class StatusResolver {
    @Query(() => String)
    status(): string {
        return 'Graphql api is working';
    }
}

export default StatusResolver;
