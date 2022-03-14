import FileUploaded from '@/dtos/responses/FileUploaded';
import StoreProps from '@/dtos/interfaces/storage/store';

import uploadToTmp from './uploadToTmp';

const store = async ({
    filesToUpload,
    bucket,
    pathStructure,
}: StoreProps): Promise<FileUploaded[]> => {
    const uploadedFiles = await Promise.allSettled(
        filesToUpload.map(async file => {
            return uploadToTmp(file, bucket, pathStructure);
        }),
    );
    console.log(`Files result: ${JSON.stringify(uploadedFiles)}`);
    return uploadedFiles.map(file => {
        return file.status === 'fulfilled' ? file.value : file.reason;
    });
};

export default store;
