import fs from 'fs';
import path from 'path';

import storageConfig from '@/main/config/storage';

import Storage, {
    DeleteFileProps,
    GetFileProps,
    SaveFileProps,
} from '@/dtos/interfaces/storage';

class LocalAdapter implements Storage {
    readonly baseUrl;

    constructor(private readonly bucketName: string) {
        const {
            config: {
                local: { structure },
            },
            uploadFolder,
        } = storageConfig;

        this.baseUrl = 'http://localhost:5000/development/uploads';

        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder);
        }
        this.syncStructure(structure, uploadFolder).catch(err => {
            console.error(
                `Erro ao sincronizar a estrutura dos arquivos: ${err}`,
            );
        });
    }

    public async deleteFile({
        file,
        pathStructure,
    }: DeleteFileProps): Promise<void> {
        const structure = pathStructure ?? [];

        const filePath = path.resolve(
            storageConfig.uploadFolder,
            this.bucketName,
            ...structure,
            file,
        );

        try {
            await fs.promises.stat(filePath);
        } catch {
            return;
        }

        await fs.promises.unlink(filePath);
    }

    public async saveFile({
        file,
        pathStructure,
    }: SaveFileProps): Promise<string> {
        const structure = pathStructure ?? [];

        const source = path.resolve(storageConfig.tmpFolder, file);

        const partialDestination = path.join(
            this.bucketName,
            ...structure,
            file,
        );

        const destination = path.resolve(
            storageConfig.uploadFolder,
            partialDestination,
        );

        fs.copyFileSync(source, destination);

        return path.join(this.baseUrl, partialDestination);
    }

    public async getFileUrl({ file, pathStructure }: GetFileProps) {
        const structure = pathStructure ?? '';
        const localFilePath = path.join(...structure, file);

        const url = `${this.baseUrl}/${localFilePath}`;

        return url;
    }

    private async syncStructure(
        structure: Record<string, any>,
        pathFolder: string,
    ): Promise<void> {
        const promises = Object.entries(structure).map(async ([key, value]) => {
            if (!(value instanceof Object)) {
                this.verifyAndCreateFolder(path.resolve(pathFolder, value));
            } else {
                const subFolder = path.resolve(pathFolder, key);
                this.verifyAndCreateFolder(subFolder);
                return this.syncStructure(value, subFolder);
            }
        });
        await Promise.all(promises);
    }

    private verifyAndCreateFolder(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    }
}

export default LocalAdapter;
