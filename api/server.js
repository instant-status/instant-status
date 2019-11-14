import Koa from "koa";
import json from "koa-json";
import appRoutes from "./routes/routes";

const app = new Koa();

app.use(json());
app.use(appRoutes.routes()).use(appRoutes.allowedMethods());

const port = 3000;
app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
