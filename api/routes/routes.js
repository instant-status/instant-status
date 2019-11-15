import KoaRouter from "koa-router";
import { getDemoData, addDemoData } from "../controllers/demo";
const router = new KoaRouter();

router.get("/", ctx => (ctx.body = { version: "1.0.0" }));
router.get("demo", "/demo", async ctx => (ctx.body = getDemoData(ctx.query)));
router.post(
  "setDemo",
  "/demo",
  async ctx => (ctx.body = addDemoData(ctx.request.body))
);
router.get("/*", async ctx => (ctx.body = { error: 404 }));

export default router;
