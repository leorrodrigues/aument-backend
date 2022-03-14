/* eslint-disable dot-notation */
import { GraphQLError } from 'graphql';

import GenericError from '@/dtos/genericError';
import errorsHandler, {
    errorsFormatter,
} from '@/presentation/helpers/ErrorsHandler';

global.console = {
    ...global.console,
    error: jest.fn(),
};

class TestGenericError extends GenericError {
    constructor(error: string) {
        super(error);
        this.name = 'TestGenericError';
        this.statusCode = 0;
    }
}

describe('Erros Handler', () => {
    describe('Erros Formatter', () => {
        it('Should return an GraphQLError', () => {
            const errorName = 'testError';
            const error = new GraphQLError(errorName);
            const result = errorsFormatter(error);
            expect(result).toBeInstanceOf(GraphQLError);
            expect(result.message).toStrictEqual(errorName);
        });

        it('Should return an object with Message and statusCode as the errorName', () => {
            const errorName = 'testError';
            const error = new GraphQLError(
                errorName,
                undefined,
                undefined,
                undefined,
                undefined,
                new Error(errorName),
            );
            const result = errorsFormatter(error);

            expect(result).toMatchObject({
                statusCode: 'Error',
                message: 'testError',
            });
        });

        it('Should return an object with Message and statusCode', () => {
            const errorName = 'testError';
            const genericError = new TestGenericError(errorName);
            const error = new GraphQLError(
                errorName,
                undefined,
                undefined,
                undefined,
                undefined,
                genericError,
            );
            const result = errorsFormatter(error);

            expect(result).toMatchObject({
                statusCode: 0,
                message: 'testError',
            });
        });
    });

    describe('Errors Handler', () => {
        it('Should transform the response to have undefined data and an error specific status', () => {
            const response = { data: undefined, http: { status: 200 } };

            const errorName = 'testError';
            const genericError = new TestGenericError(errorName);
            const errors = [
                new GraphQLError(
                    errorName,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    genericError,
                ),
            ];

            errorsHandler(response, errors);

            expect(response).toMatchObject({
                data: undefined,
                http: { status: 0 },
            });
        });

        it('Should transform the response to have undefined data and an error 500', () => {
            const response = { data: undefined, http: { status: 200 } };

            const errorName = 'testError';
            const errors = [new Error(errorName)];

            errorsHandler(response, errors as GraphQLError[]);

            expect(response).toMatchObject({
                data: undefined,
                http: { status: 500 },
            });
        });
    });
});
