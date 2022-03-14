import { json, urlencoded } from 'express';

const jsonBodyParser = json({ limit: '10mb' });

const urlencodedBodyParser = urlencoded({ extended: true });

export default [jsonBodyParser, urlencodedBodyParser];
