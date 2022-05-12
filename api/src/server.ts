import 'dotenv/config';

import cors from '@koa/cors';
import { API_CONFIG } from 'is-config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';

import { isRequestAllowed } from './controllers/auth';
import router from './routes/routes';

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

app.use(router.routes()).use(router.allowedMethods());

const port = API_CONFIG.PORT || 3000;
app.listen(port, () =>
  console.info(`Server started on http://localhost:${port}`)
);

if (process.send) process.send('ready');
