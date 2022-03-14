import jwt, { SignOptions } from 'jsonwebtoken';
import dayjs from 'dayjs';

import { Decrypter, Encrypter } from '@/dtos/interfaces/cryptography';

class JWTAdapter implements Encrypter, Decrypter {
    constructor(private readonly secret: string) {}

    async encrypt(
        payload: Record<string, unknown> | string,
        expires?: SignOptions['expiresIn'],
    ): Promise<string> {
        const date = dayjs().add(1, 'day').startOf('day');
        const now = dayjs();
        const expiresIn = expires ?? date.diff(now, 'seconds');
        return jwt.sign(payload, this.secret, { expiresIn });
    }

    async decrypt(chiperText: string): Promise<Record<string, unknown>> {
        return jwt.verify(this.removeBearer(chiperText), this.secret) as any;
    }

    private removeBearer(token: string) {
        if (!token.includes('Bearer')) {
            return token;
        }
        const tokenContent = token.split(' ')[1];
        return tokenContent;
    }
}

export default JWTAdapter;
