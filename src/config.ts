import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface IConfig {
    port: number;
    debugLogging: boolean;
    dbsslconn: boolean;
    databaseUrl: string;
}

const config: IConfig = {
    port: +process.env.PORT || 3000,
    debugLogging: process.env.NODE_ENV == 'development',
    dbsslconn: process.env.NODE_ENV != 'development',
    databaseUrl: process.env.NODE_ENV == 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL
};

export { config };
