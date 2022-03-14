import express, { Express } from 'express';
import { resolve } from 'path';

export default (app: Express): void => {
    const path = resolve(__dirname, '..', '..', '..', '..', 'uploads');
    app.use('/uploads', express.static(path));
};
