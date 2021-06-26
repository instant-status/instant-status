import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import db from 'diskdb';

import router from './routes/routes';
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

db.connect('../data/', ['instances', 'updates', 'updateHistory']);

app.use(router.routes()).use(router.allowedMethods());

const port = APP_CONFIG.PORT || 3000;
app.listen(port, () =>
  console.info(`Server started on http://localhost:${port}`)
);
