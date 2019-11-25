import KoaRouter from "koa-router";
import { addDemoData, getDemoData } from "../controllers/demo";
import {
  addPrimalInstance,
  deleteInstance,
  getInstances
} from "../controllers/instances";

const router = new KoaRouter();

// Home
router.get("/", ctx => (ctx.body = { version: "1.0.0" }));

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

// Instance Creation
router.post(
  "createInstance",
  "/instance/hello",
  async ctx => (ctx.body = addPrimalInstance(ctx.request.body))
);

// Instance Update
router.patch(
  "updateInstance",
  "/instance/update",
  async ctx => (ctx.body = addDemoData(ctx.request.body))
);

// Instance Delete
router.delete(
  "deleteInstance",
  "/instance/delete",
  async ctx => (ctx.body = deleteInstance(ctx.request.body))
);

export default router;
