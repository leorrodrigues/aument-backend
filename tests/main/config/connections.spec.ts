import { buildConnections } from '@/main/config/orm/connections';
import env from '@/main/config/env';

describe('ORM Connections', () => {
    it('Should create a connection', () => {
        env.DB_CONNECTIONS = {
            dbTest: {
                HOST: 'hostTest',
                PORT: '0',
                USERNAME: 'userTest',
                PASSWORD: 'passwordTest',
                DATABASE: 'dbTest',
            },
        };
        const connections = buildConnections();
        expect(connections).toMatchObject({
            dbTest: {
                uri: 'mongodb://hostTest:0/dbTest',
                username: 'userTest',
                password: 'passwordTest',
            },
        });
        expect(connections).toBeDefined();
    });
});
