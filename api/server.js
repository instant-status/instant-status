import Koa from "koa";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";
import cors from "@koa/cors";
import googleSignInAuth from "koa-google-sign-in";
import appRoutes from "./routes/routes";

const app = new Koa();

dotenv.config();

app.use(cors());
app.use(json());
app.use(bodyParser());
// Comment in to auth ui
app.use(
  googleSignInAuth({
    clientId: process.env.GOOGLE_SIGN_IN_CLIENT_ID
  })
);
app.use(appRoutes.routes()).use(appRoutes.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
