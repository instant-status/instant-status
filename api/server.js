import Koa from "koa";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import bearerToken from "koa-bearer-token";
import cors from "@koa/cors";

import dotenv from "dotenv";

import appRoutes from "./routes/routes";
import { isRequestAuthenticated } from "./controllers/auth";

const app = new Koa();

dotenv.config();

app.use(cors());
app.use(json());
app.use(bodyParser());
app.use(bearerToken());

// Comment in to auth ui

app.use((ctx, next) => {
  if (isRequestAuthenticated(ctx.request)) {
    next();
  } else {
    ctx.status = 401;
    ctx.body = {
      error: 401,
      message: "Please authenticate yourself!"
    };
  }
});

app.use(appRoutes.routes()).use(appRoutes.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
