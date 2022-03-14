import { Express, Router } from 'express';

import routes from '@/presentation/routes';

export default (app: Express): void => {
    const router = Router();
    app.use('/api', router);

    Object.values(routes).forEach(route => {
        route(router);
    });
};
