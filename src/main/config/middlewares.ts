import { Express } from 'express';
import helmet from 'helmet';

import middlewares from '@/main/middlewares';

const { bodyParser, cors, contentType } = middlewares;

export default (app: Express): void => {
    bodyParser.forEach(item => {
        app.use(item);
    });
    app.use(helmet());
    app.use(cors);
    app.use(contentType);
};
