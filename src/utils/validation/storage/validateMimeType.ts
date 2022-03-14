import env from '@/main/config/env';

import { MimeTypeProps } from '@/dtos/interfaces/storage/validate';

const validateMimeType = (mimeType: MimeTypeProps) =>
    mimeType in env.FILE_SIZE_MIME_TYPE;

export default validateMimeType;
