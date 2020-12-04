import KoaRouter from "@koa/router";
import { addDemoData, getDemoData } from "../../controllers/demo";
import {
  addPrimalInstance,
  deleteInstance,
  getInstances,
  updateInstance,
  doneUpdatingInstance
} from "../../controllers/instances";

import { authGoogle } from "../../controllers/auth";

const routerV1 = new KoaRouter();

// Home
routerV1.get("home", "/", ctx => (ctx.body = { version: "1.0.0" }));

// Google Auth
routerV1.get("auth", "/auth/google/callback", authGoogle);

// Demo data
routerV1.get("demo", "/demo", async ctx => (ctx.body = getDemoData(ctx.query)));
routerV1.post(
  "setDemo",
  "/demo",
  async ctx => (ctx.body = addDemoData(ctx.request.body))
);

// Instance Fetching
routerV1.get(
  "getInstances",
  "/instances",
  async ctx => (ctx.body = getInstances(ctx.query))
);

// Instance Creation
routerV1.post(
  "createInstance",
  "/instance/hello",
  async ctx => (ctx.response.status = addPrimalInstance(ctx.request.body))
);

// Instance Update
routerV1.patch(
  "updateInstance",
  "/instance/update",
  async ctx => (ctx.response.status = updateInstance(ctx.request.body))
);

// Instance Update
routerV1.patch(
  "finishUpdateInstance",
  "/instance/update/done",
  async ctx => (ctx.response.status = doneUpdatingInstance(ctx.request.body))
);

// Instance Delete
routerV1.delete(
  "deleteInstance",
  "/instance/delete",
  async ctx => (ctx.response.status = deleteInstance(ctx.request.body))
);

export {
  routerV1
};
