import * as Koa from 'koa';

import application from './server'
import {config} from "./config";

application.then((app:Koa) => {
    app.listen(config.port);
    console.log(`Server running on port ${config.port}`);
});
