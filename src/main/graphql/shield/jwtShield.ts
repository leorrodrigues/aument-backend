import BadCredentials from '@/domain/repositories/errors/BadCredentials';
import userRepositoryFactory from '@/factories/repositories/aument/userRepositoryFactory';
import { AuthChecker } from 'type-graphql';

const jwtShield: AuthChecker<any> = ({ context }) => {
    try {
        const { userId } = context.token;
        const user = userRepositoryFactory().get(userId);
        if (!user) {
            return false;
        }
        return true;
    } catch (err) {
        throw new BadCredentials();
    }
};

export default jwtShield;
