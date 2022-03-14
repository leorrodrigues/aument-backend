import UserType from '@/domain/models/aument/User/UserType';

import UpdateUserInput from '@/dtos/inputs/user/UpdateUserInput';
import { HashComparer, Hasher } from '@/dtos/interfaces/cryptography';

import validatePasswordFields from './validatePasswordFields';

const processUpdateUserData = async (
    user: UserType,
    data: UpdateUserInput,
    cryptographyAdapter: HashComparer & Hasher,
) => {
    const isNewPasswordValid = await validatePasswordFields(
        data,
        user.password,
        cryptographyAdapter,
    );

    if (isNewPasswordValid) {
        Object.assign(data, {
            password: await cryptographyAdapter.hash(data.newPassword!),
        });
    } else {
        delete data.password;
    }

    delete data.newPassword;
    delete data.newPasswordConfirmation;

    Object.assign(user, {
        ...data,
    });
};

export default processUpdateUserData;
