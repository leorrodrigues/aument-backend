export default interface Token {
    userId: number | undefined;
    iat: number;
    exp: number;
}
