/* istanbul ignore file */
import GenericError from '@/dtos/genericError';

class ForbiddenError extends GenericError {
    constructor(message = 'User not authorized to perform this action.') {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}

export default ForbiddenError;
