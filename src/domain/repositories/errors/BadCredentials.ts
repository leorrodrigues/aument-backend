/* istanbul ignore file */
import GenericError from '@/dtos/genericError';

class BadCredentials extends GenericError {
    constructor() {
        super(`Invalid credentials.`);
        this.name = 'BadCredentialsError';
        this.statusCode = 401;
    }
}

export default BadCredentials;
