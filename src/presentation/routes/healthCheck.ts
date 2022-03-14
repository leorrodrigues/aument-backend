import { Router } from 'express';

export default (router: Router): void => {
    router.get('/healthcheck', async (req, res) => {
        return res.status(200).send({ status: 'API is running 🚀' });
    });
};
