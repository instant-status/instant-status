import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import router from './routes/routes';
import { isRequestAllowed } from './controllers/auth';
import { API_CONFIG } from 'is-config';

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
