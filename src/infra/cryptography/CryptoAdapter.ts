import { scryptSync } from 'crypto';

import { HashComparer, Hasher } from '@/dtos/interfaces/cryptography';

export class CryptoAdapter implements Hasher, HashComparer {
    constructor(
        private readonly cryptoSize: number,
        private readonly salt: string,
    ) {}

    async hash(plainText: string): Promise<string> {
        return scryptSync(plainText, this.salt, this.cryptoSize).toString(
            'hex',
        );
    }

    async compare(plainText: string, cipherText: string): Promise<boolean> {
        return (await this.hash(plainText)) === cipherText;
    }
}

export default CryptoAdapter;
