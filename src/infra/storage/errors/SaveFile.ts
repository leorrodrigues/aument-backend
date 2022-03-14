import GenericError from '@/dtos/genericError';

class SaveFile extends GenericError {
    constructor(fileName: string) {
        super(`Erro ao salvar o arquivo ${fileName}.`);
        this.name = 'SaveFileError';
        this.statusCode = 500;
    }
}

export default SaveFile;
