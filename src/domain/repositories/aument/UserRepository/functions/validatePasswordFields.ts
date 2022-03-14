import { HashComparer, Hasher } from '@/dtos/interfaces/cryptography';

const validatePasswordFields = async (
    data: Record<string, any>,
    userPassword: string,
    cryptographyAdapter: HashComparer & Hasher,
) => {
    if (
        ['passsword', 'newPassword', 'newPasswordConfirmation'].every(
            element => !(`${element}` in data),
        )
    ) {
        return false;
    }

    if (
        !['password', 'newPassword', 'newPasswordConfirmation'].every(
            element => `${element}` in data,
        ) ||
        data.newPassword !== data.newPasswordConfirmation ||
        !(await cryptographyAdapter.compare(data.password, userPassword))
    ) {
        throw new Error('Invalid password data');
    }

    return true;
};

export default validatePasswordFields;
