export type OrmConnectionValueProps = {
    HOST: string;
    PORT: string;
    USERNAME: string;
    PASSWORD: string;
    DATABASE: string;
};

export interface OrmConnectionsEnv {
    [key: string]: OrmConnectionValueProps;
}

export default interface OrmConnections {
    [key: string]: {
        uri: string;
        username: string;
        password: string;
    };
}
