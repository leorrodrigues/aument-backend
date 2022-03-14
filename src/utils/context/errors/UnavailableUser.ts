import GenericError from '@/dtos/genericError';

class UnavailableUser extends GenericError {
    constructor() {
        super(`Unauthenticated user.`);
        this.name = 'UnavailableUserError';
        this.statusCode = 401;
    }
}

export default UnavailableUser;
