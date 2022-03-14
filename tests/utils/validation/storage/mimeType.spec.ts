import validateMimeType from '@/utils/validation/storage/validateMimeType';

describe('Validation Mime Type', () => {
    it('Should return true with valid mime type', () => {
        const mimeType = 'text/plain';
        const isValid = validateMimeType(mimeType);
        expect(isValid).toBeTruthy();
    });

    it('Should return true with valid mime type', () => {
        const mimeType = 'invalid/mimeType';
        const isValid = validateMimeType(mimeType);
        expect(isValid).toBeFalsy();
    });
});
