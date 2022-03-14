import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import {
    ApolloServerPlugin,
    BaseContext,
    GraphQLRequestContextWillSendResponse,
} from 'apollo-server-plugin-base';

import errorsHandler from '@/presentation/helpers/ErrorsHandler';
import successHandler from '@/presentation/helpers/SuccesssHandler';

const plugins: ApolloServerPlugin<BaseContext>[] = [
    {
        requestDidStart: async () => ({
            willSendResponse: async ({
                response,
                errors,
            }: GraphQLRequestContextWillSendResponse<BaseContext>) =>
                errors
                    ? errorsHandler(response, errors)
                    : successHandler(response),
        }),
    },
    ApolloServerPluginInlineTrace(),
];

export default plugins;
