import express, { Express } from 'express';
import { graphqlUploadExpress } from 'graphql-upload';

import apolloServerSetup from './apolloServer/setup';
import staticFiles from './staticFiles';
import middlewares from './middlewares';
import routes from './routes';

const buildApp: () => Express = () => {
    const app = express();

    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    apolloServerSetup(app);
    staticFiles(app);
    middlewares(app);
    routes(app);

    return app;
};

export default buildApp;
