/* eslint-disable import/no-extraneous-dependencies */
import {
    APIGatewayProxyEvent,
    APIGatewayProxyEventV2,
    Context,
} from 'aws-lambda';
import 'reflect-metadata';
import serverless from 'serverless-http';

import appBuild from '@/main/config/buildApp';

import MongooseManager from './config/MongooseManager';

const app = appBuild();
const server = serverless(app);

export const handler = async (
    event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
    context: Context,
) => {
    try {
        console.log('Connecting to Mongoose DB');
        await MongooseManager.connect('aument');
        console.log('Connected');
        console.log('Starting api');
        const result = await server(event, context);
        console.log(`Shutting down api, result ${JSON.stringify(result)}`);
        return result;
    } catch (err: any) {
        console.error(err);
        throw new Error(err);
    }
};

export default handler;
