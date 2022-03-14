import storageAdapterFactory from '@/factories/adapters/storageAdapterFactory';

interface UploadToBucketProps {
    filename: string;
    originalName: string;
    bucket: string;
    pathStructure?: string[];
    resolve: (value: unknown) => void;
    reject: (value: unknown) => void;
}

const uploadToBucket = async ({
    filename,
    originalName,
    bucket,
    pathStructure,
    resolve,
    reject,
}: UploadToBucketProps) => {
    try {
        const storageAdapter = storageAdapterFactory(bucket);

        const url = await storageAdapter.saveFile({
            file: filename,
            pathStructure,
        });

        return resolve({
            originalName,
            uploadedName: filename,
            url,
        });
    } catch (err) {
        const message = `Failed to save file ${filename} into bucket ${bucket}.`;
        console.error(message);
        return reject({
            originalName,
            errorMessage: message,
        });
    }
};

export default uploadToBucket;
