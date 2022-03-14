import { Express } from 'express';
import request from 'supertest';

import appConfig from '@/main/config/buildApp';

describe('Health Check Route', () => {
    let app: Express;

    beforeAll(async () => {
        app = appConfig();
    });

    describe('GET /api/healthcheck', () => {
        test('Should return 200 with a successful message', async () => {
            await request(app)
                .get('/api/healthcheck')
                .expect(200)
                .expect({ status: 'API is running 🚀' });
        });
    });
});
