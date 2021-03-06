import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import db from 'diskdb';

import { routerV1, routerV2 } from './routes/routes';
import { isRequestAllowed } from './controllers/auth';
import APP_CONFIG from '../../config/appConfig';

const app = new Koa();

app.use(cors());
app.use(json());
app.use(bodyParser());

app.use((ctx, next) => {
  if (isRequestAllowed(ctx.request)) {
    return next();
  } else {
    ctx.status = 401;
  }
});

db.connect('../data/', ['instances', 'updates', 'updatesHistory']);

app
  .use(routerV1.routes())
  .use(routerV2.routes())
  .use(routerV1.allowedMethods());

const port = APP_CONFIG.PORT || 3000;
app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
