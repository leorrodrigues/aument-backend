import { FileUpload } from 'graphql-upload';

export default interface StoreProps {
    filesToUpload: FileUpload[];
    bucket: string;
    pathStructure?: string[];
    presignedUrl?: string;
    createNewName?: boolean;
}
