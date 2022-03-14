/* eslint-disable no-restricted-syntax */
import request from 'supertest';
import { Express } from 'express';

import appConfig from '@/main/config/buildApp';

import validToken from '../validToken';

global.console = {
    ...global.console,
    error: jest.fn(),
    log: jest.fn(),
};

describe('Health Check Resolver', () => {
    let app: Express;

    beforeAll(async () => {
        app = appConfig();
    });

    it('Should be able to list one user by his userID', async () => {
        const response = await request(app)
            .post('/graphql')
            .set('content-type', 'application/json; charset=utf-8')
            .set('Authorization', validToken)
            .send({
                query: `query {
                    healthCheck
                }`,
            });

        const { status, text } = response;
        const {
            data: { healthCheck },
        } = JSON.parse(text);

        expect(status).toBe(200);
        expect(healthCheck).toBe('API is running 🚀');
    });
});
