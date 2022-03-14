/* eslint-disable @typescript-eslint/ban-types */
import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { buildSchemaSync, NonEmptyArray } from 'type-graphql';
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';

import jwtShield from '@/main/graphql/shield/jwtShield';

import { errorsFormatter } from '@/presentation/helpers/ErrorsHandler';

import plugins from './plugins';
import context from './context';

import getResolvers from '../getResolvers';
import env from '../env';

export default (app: Express): void => {
    const resolvers = getResolvers() as unknown as NonEmptyArray<Function>;

    const schema = buildSchemaSync({
        resolvers,
        authChecker: jwtShield,
    });

    const server = new ApolloServer({
        schema,
        formatError: errorsFormatter,
        context,
        plugins,
        introspection: env.ENV === 'development',
        validationRules: [depthLimit(5), createComplexityLimitRule(1000, {})],
    });

    /* istanbul ignore next */
    server
        .start()
        .then(() => {
            server.applyMiddleware({ app });
        })
        .catch(err => {
            console.error(err);
        });
};
