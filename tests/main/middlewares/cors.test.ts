import { Express } from 'express';
import request from 'supertest';

import appConfig from '@/main/config/buildApp';

describe('CORS Middleware', () => {
    let app: Express;

    beforeAll(async () => {
        app = appConfig();
        return app;
    });
    test('Should enable CORS', async () => {
        app.get('/test_cors', (req, res) => {
            res.send();
        });
        await request(app)
            .get('/test_cors')
            .expect('access-control-allow-origin', '*')
            .expect('access-control-allow-methods', '*')
            .expect('access-control-allow-headers', '*');
    });
});
