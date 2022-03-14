import { Express } from 'express';
import request from 'supertest';

import appConfig from '@/main/config/buildApp';
import cache from '@/main/middlewares/cache';

describe('Cache Middleware', () => {
    let app: Express;

    beforeAll(async () => {
        app = appConfig();
        return app;
    });
    test('Should disable cache', async () => {
        app.get('/test_no_cache', cache, (req, res) => {
            res.send();
        });
        await request(app)
            .get('/test_no_cache')
            .expect(
                'cache-control',
                'max-age=86400, must-revalidate, proxy-revalidate',
            );
    });
});
