import mongoose from 'mongoose';

import connectionsUri from '@/main/config/orm/connections';

const MongooseManager = {
    connections: {} as unknown as Record<string, typeof mongoose>,

    async createConnection(database: string): Promise<void> {
        const connectionData = connectionsUri[database];
        if (!connectionData) {
            throw new Error(`The connection ${database} is not defined`);
        }
        const { uri, username, password } = connectionData;

        console.log(`Creating connection: ${uri}`);
        const connection = await mongoose.connect(uri, {
            auth: {
                username,
                password,
            },
            authSource: 'admin',
        });

        this.connections[database] = connection;
    },

    async connect(database: string) {
        if (!(database in this.connections)) {
            await this.createConnection(database);
        }

        return this.connections[database];
    },
};

export default MongooseManager;
