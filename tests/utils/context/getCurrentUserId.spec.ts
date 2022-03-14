import getCurrentUserId from '@/utils/context/getCurrentUserId';
import UnavailableUser from '@/utils/context/errors/UnavailableUser';

describe('Get Current User From Token', () => {
    it('Should throw when not find userId inside token', () => {
        try {
            getCurrentUserId({ token: undefined });
        } catch (e) {
            expect(e).toBeInstanceOf(UnavailableUser);
        }
    });

    it('Should throw when not find userId inside token', () => {
        try {
            getCurrentUserId({ token: { userId: undefined } });
        } catch (e) {
            expect(e).toBeInstanceOf(UnavailableUser);
        }
    });

    it('Should be able to retrieve the userId from token', () => {
        const id = getCurrentUserId({ token: { userId: 1 } });
        expect(id).toBe(1);
    });
});
