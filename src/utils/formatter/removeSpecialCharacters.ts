const removeSpecialCharacters = (value: string) =>
    value.replace(/[^\sA-Za-z0-9_-]/gi, '');

export default removeSpecialCharacters;
