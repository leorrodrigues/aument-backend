import { GraphQLError } from 'graphql';

import GenericError from '@/dtos/genericError';

export const errorsFormatter = (error: GraphQLError) => {
    console.error(error);
    if (!error.originalError) {
        return error;
    }
    const { name, statusCode, message } = error.originalError as GenericError;
    return { statusCode: statusCode ?? name, message };
};

const errorsHandler = async (
    response: any,
    errors: readonly GraphQLError[],
) => {
    errors.forEach(error => {
        response.data = undefined;
        response.http.status =
            (error.originalError as GenericError)?.statusCode ?? 500;
    });
};

export default errorsHandler;
