import GenericError from '@/dtos/genericError';

class BucketNotDefined extends GenericError {
    constructor(bucketName: string) {
        super(`Unknown bucket ${bucketName}.`);
        this.name = 'BucketNotDefinedError';
        this.statusCode = 500;
    }
}

export default BucketNotDefined;
