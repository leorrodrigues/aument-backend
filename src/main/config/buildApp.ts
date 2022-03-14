import express, { Express } from 'express';

import apolloServerSetup from './apolloServer/setup';
import staticFiles from './staticFiles';
import middlewares from './middlewares';
import routes from './routes';

const buildApp: () => Express = () => {
    const app = express();

    apolloServerSetup(app);
    staticFiles(app);
    middlewares(app);
    routes(app);

    return app;
};

export default buildApp;
