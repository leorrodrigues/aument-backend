/* istanbul ignore file */
import GenericError from '@/dtos/genericError';

class NotFound extends GenericError {
    constructor(instance: string, id?: string) {
        super(`${instance} ${id ?? ''} not found.`);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export default NotFound;
