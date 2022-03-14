export interface Decrypter {
    decrypt: (cipherText: string) => Promise<Record<string, unknown> | string>;
}
