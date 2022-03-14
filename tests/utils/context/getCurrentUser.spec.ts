import getCurrentUser from '@/utils/context/getCurrentUser';
import UnavailableUser from '@/utils/context/errors/UnavailableUser';

describe('Get Current User From Token', () => {
    it('Should throw when not find user name inside token', () => {
        try {
            getCurrentUser({ token: undefined });
        } catch (e) {
            expect(e).toBeInstanceOf(UnavailableUser);
        }
    });

    it('Should be able to retrieve the user name from token', () => {
        const name = getCurrentUser({
            token: {
                userLogin: 'testAuth',
            },
        });
        expect(name).toStrictEqual('testAuth');
    });
});
