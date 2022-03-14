import validateFileSize, {
    getMaxSizeThroughMimeType,
} from '@/utils/validation/storage/validateFileSize';

const BYTE = 1024;
const MEGABYTE = 1024 * BYTE;

describe('Validation File Size', () => {
    it('Should return false with invalid file size', () => {
        const mimeType = 'text/plain';
        const fileSize = 3 * MEGABYTE;

        const isValid = validateFileSize({ mimeType, fileSize });

        expect(isValid).toBeFalsy();
    });

    it('Should return true with valid file size', () => {
        const mimeType = 'text/plain';
        const fileSize = 1.5 * MEGABYTE;

        const isValid = validateFileSize({ mimeType, fileSize });

        expect(isValid).toBeTruthy();
    });

    it('Should return false with invalid mime type', () => {
        const mimeType = 'invalid/mimetype';
        const fileSize = 1.5 * MEGABYTE;

        const isValid = validateFileSize({ mimeType, fileSize });

        expect(isValid).toBeFalsy();
    });

    it('Should be able to get the max file allowed', () => {
        const maxSize = getMaxSizeThroughMimeType('text/plain');
        expect(maxSize).toStrictEqual('2MB');
    });
});
