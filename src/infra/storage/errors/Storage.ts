import GenericError from '@/dtos/genericError';

class Storage extends GenericError {
    constructor(storageName: string, bucketName: string) {
        super(`Erro ao realizar a operação no ${storageName}:${bucketName}.`);
        this.name = 'StorageError';
        this.statusCode = 500;
    }
}

export default Storage;
