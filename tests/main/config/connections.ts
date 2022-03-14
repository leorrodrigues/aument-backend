import OrmConnections, {
    OrmConnectionsEnv,
} from '@/dtos/interfaces/ormConnections';

import env from '@/main/config/env';

export const buildConnections = () => {
    const connections: OrmConnectionsEnv = env.DB_CONNECTIONS;

    const ormConnections: OrmConnections = {};
    Object.entries(connections).forEach(([connectionName, value]) => {
        const { HOST, PORT, USERNAME, PASSWORD, DATABASE } = value;

        ormConnections[`${connectionName}`] = {
            uri: `mongodb://${HOST}:${PORT}/${DATABASE}`,
            username: USERNAME,
            password: PASSWORD,
        };
    });

    return ormConnections;
};

export default buildConnections();
