/* eslint-disable no-template-curly-in-string */
// eslint-disable-next-line import/no-import-module-exports
import type { AWS } from '@serverless/typescript';

const provider: AWS['provider'] = {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: '${self:custom.stage}',
    memorySize: 512,
    timeout: 30,
    architecture: 'arm64',
    apiGateway: {
        shouldStartNameWithService: true,
        minimumCompressionSize: 1024,
        binaryMediaTypes: ['*/*'],
    },
    logRetentionInDays: 7,
    tags: {
        Project: 'aument',
        Env: '${self:provider.stage}',
    },
    stackTags: {
        Projeto: 'aument',
        Env: '${self:provider.stage}',
    },
    deploymentBucket: 'deployment-serverless-bucket',
};

const plugins: AWS['plugins'] = [
    'serverless-plugin-typescript',
    'serverless-tscpaths',
    'serverless-layers',
    'serverless-plugin-static',
    'serverless-offline',
    'serverless-dotenv-plugin',
];

const packageServerless: AWS['package'] = {
    // excludeDevDependencies: true,
    patterns: [
        'package.json',
        '!node_modules/**/@types/**',
        '!node_modules/**/*.d.ts',
        '!node_modules/**/.yarn-integrity',
        '!tests/**',
    ],
};

const custom: AWS['custom'] = {
    static: {
        folder: './uploads',
        port: 8080,
    },
    'serverless-layers': {
        packageManager: 'yarn',
    },
    'serverless-offline': {
        httpPort: 5000,
        useChildProcesses: true,
    },
    stage: '${env:NODE_ENV, "development"}',
    'default-name': '${self:service}-${self:provider.stage}',
    role: {
        production: '',
        staging: '',
        development: '',
    },
    endpoint: {
        production: 'https://aument.com.br',
        staging: 'https://homolog-aument.com.br',
        development: '0.0.0.0',
    },
};

const functions: AWS['functions'] = {
    healthCheck: {
        name: '${self:custom.default-name}-healthCheck',
        handler: 'src/main/server.handler',
        events: [
            {
                http: {
                    method: 'GET',
                    path: '/api/healthcheck',
                    cors: {
                        origin: '*',
                        headers: [
                            'Content-Type',
                            'X-Amz-Date',
                            'Authorization',
                            'X-Api-Key',
                            'X-Amz-Security-Token',
                            'X-Amz-User-Agent',
                        ],
                    },
                },
            },
        ],
    },
    graphql: {
        name: '${self:custom.default-name}-graphql',
        handler: 'src/main/server.handler',
        events: [
            {
                http: {
                    method: 'POST',
                    path: '/graphql',
                    cors: {
                        origin: '*',
                        headers: [
                            'Content-Type',
                            'X-Amz-Date',
                            'Authorization',
                            'X-Api-Key',
                            'X-Amz-Security-Token',
                            'X-Amz-User-Agent',
                        ],
                    },
                },
            },
        ],
    },
};

const serverlessConfiguration: AWS & { stepFunctions?: Record<string, any> } = {
    service: 'aument',
    frameworkVersion: '3',
    custom,
    useDotenv: true,
    plugins,
    provider,
    functions,
    configValidationMode: 'error',
    package: packageServerless,
};

module.exports = serverlessConfiguration;
