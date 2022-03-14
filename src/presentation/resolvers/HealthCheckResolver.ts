import { Resolver, Query } from 'type-graphql';

@Resolver()
class HealthCheckResolver {
    @Query(() => String)
    async healthCheck() {
        return 'API is running 🚀';
    }
}

export default HealthCheckResolver;
