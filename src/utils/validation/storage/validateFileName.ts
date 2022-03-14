import removeDiacritics from '@/utils/formatter/removeDiacritics';
import removeSpecialCharacters from '@/utils/formatter/removeSpecialCharacters';
import removeWhiteSpaces from '@/utils/formatter/removeWhiteSpaces';

const validateFileName = (fileName: string) => {
    const fileWithoutSpace = removeWhiteSpaces(fileName);

    const fileWithoutDiacritics = removeDiacritics(fileWithoutSpace);

    const fileWithoutSpecialCharacters = removeSpecialCharacters(
        fileWithoutDiacritics,
    );

    return fileWithoutSpecialCharacters;
};

export default validateFileName;
