import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import * as PostgressConnectionStringParser from 'pg-connection-string';

import { config } from './config';
import { router } from './routes';

dotenv.config({ path: '.env' });
const connectionOptions = PostgressConnectionStringParser.parse(config.databaseUrl);

let application = createConnection({
    type: 'postgres',
    host: connectionOptions.host,
    port: connectionOptions.port,
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    synchronize: true,
    logging: true,
    entities: [
       'dist/entity/**/*{.ts,.js}'
    ],
    extra: {
        ssl: false,
    }
 }).then(async connection => {
    const app = new Koa();
    app.use(cors());
    app.use(bodyParser());
    app.use(router.routes()).use(router.allowedMethods());

    return app;
}).catch(error => console.log('TypeORM connection error: ', error));

export default application;
