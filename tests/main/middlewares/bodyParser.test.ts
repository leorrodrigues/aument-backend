import { Express } from 'express';
import request from 'supertest';

import appConfig from '@/main/config/buildApp';

describe('Body Parser Middleware', () => {
    let app: Express;

    beforeAll(async () => {
        app = appConfig();
        return app;
    });

    test('Should parse body as json', async () => {
        app.post('/test_body_parser', (req, res) => {
            res.send(req.body);
        });
        await request(app)
            .post('/test_body_parser')
            .send({ name: 'GraphQL POC' })
            .expect({ name: 'GraphQL POC' });
    });
});
