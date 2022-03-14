import env from '@/main/config/env';

import {
    MimeTypesWithSize,
    ValidateSizeProps,
} from '@/dtos/interfaces/storage/validate';

const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

const measurementSize = {
    KB,
    MB,
    GB,
};

const validateFileSize = ({ mimeType, fileSize }: ValidateSizeProps) => {
    const fileSizeMimeType: MimeTypesWithSize = env.FILE_SIZE_MIME_TYPE;
    if (!(mimeType in fileSizeMimeType)) return false;

    const { size, measurementUnit } = fileSizeMimeType[mimeType];
    const maxSize = size * measurementSize[measurementUnit];

    return fileSize <= maxSize;
};

export const getMaxSizeThroughMimeType = (mimeType: string) => {
    const fileSizeMimeType: MimeTypesWithSize = env.FILE_SIZE_MIME_TYPE;

    const { size, measurementUnit } = fileSizeMimeType[mimeType];
    return `${size}${measurementUnit}`;
};

export default validateFileSize;
