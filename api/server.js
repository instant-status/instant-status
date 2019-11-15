import Koa from "koa";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";
import appRoutes from "./routes/routes";

const app = new Koa();

dotenv.config();

app.use(json());
app.use(bodyParser());
app.use(appRoutes.routes()).use(appRoutes.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
