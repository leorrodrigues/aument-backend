import mongoose from 'mongoose';

import connectionsUri from './connections';

const MongooseManager = {
    connections: {} as unknown as Record<string, typeof mongoose>,

    async createConnection(database: string): Promise<void> {
        const connectionData = connectionsUri[database];
        if (!connectionData) {
            throw new Error(`The connection ${database} is not defined`);
        }
        const { uri, username, password } = connectionData;

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

    async disconnect(database: string) {
        await this.connections[database].disconnect();
        delete this.connections[database];
    },

    async clearDB(database: string) {
        const { models } = this.connections[database];
        const promises = Object.entries(models).map(([_, model]) => {
            return model.deleteMany({});
        });
        await Promise.all(promises);
    },
};

export default MongooseManager;
