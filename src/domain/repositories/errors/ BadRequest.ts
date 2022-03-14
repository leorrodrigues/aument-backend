/* istanbul ignore file */
import GenericError from '@/dtos/genericError';

class BadRequest extends GenericError {
    constructor(message = 'Invalid request format') {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400;
    }
}

export default BadRequest;
