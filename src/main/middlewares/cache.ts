import { Request, Response, NextFunction } from 'express';

export const cache = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    res.set(
        'cache-control',
        'max-age=86400, must-revalidate, proxy-revalidate',
    );
    next();
};

export default cache;
