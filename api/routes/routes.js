import KoaRouter from "koa-router";
import { addDemoData, getDemoData } from "../controllers/demo";
import {
  addPrimalInstance,
  deleteInstance,
  getInstances,
  updateInstance,
  doneUpdatingInstance,
  getInstancesMeta,
} from "../controllers/instances";
import { authGoogle } from "../controllers/auth";

const router = new KoaRouter();

// Home
router.get("home", "/", ctx => (ctx.body = { version: "1.0.0" }));

// Google Auth
router.get("auth", "/auth/google/callback", authGoogle);

// Demo data
router.get("demo", "/demo", async ctx => (ctx.body = getDemoData(ctx.query)));
router.post(
  "setDemo",
  "/demo",
  async ctx => (ctx.body = addDemoData(ctx.request.body))
);

// Instance Fetching
router.get(
  "getInstances",
  "/instances",
  async ctx => (ctx.body = getInstances(ctx.query))
);

// Instance Metadata Fetching
router.get(
  "getInstancesMeta",
  "/instances/meta",
  async ctx => (ctx.body = getInstancesMeta(ctx.query))
);

// Instance Creation
router.post(
  "createInstance",
  "/instance/hello",
  async ctx => (ctx.response.status = addPrimalInstance(ctx.request.body))
);

// Instance Update
router.patch(
  "updateInstance",
  "/instance/update",
  async ctx => (ctx.response.status = updateInstance(ctx.request.body))
);

// Instance Update
router.patch(
  "finishUpdateInstance",
  "/instance/update/done",
  async ctx => (ctx.response.status = doneUpdatingInstance(ctx.request.body))
);

// Instance Delete
router.delete(
  "deleteInstance",
  "/instance/delete",
  async ctx => (ctx.response.status = deleteInstance(ctx.request.body))
);

export default router;
