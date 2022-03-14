export interface SaveFileProps {
    file: string;
    pathStructure?: string[];
}

export interface DeleteFileProps {
    file: string;
    pathStructure?: string[];
}

export interface GetFileProps {
    file: string;
    pathStructure?: string[];
}

export default interface Storage {
    readonly baseUrl: string;

    saveFile(data: SaveFileProps): Promise<string>;
    deleteFile(data: DeleteFileProps): Promise<void>;
    getFileUrl(data: GetFileProps): Promise<string>;
}
