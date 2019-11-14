import KoaRouter from "koa-router";
import { getDemo } from "../controllers/demo";
const router = new KoaRouter();

router.get("/", ctx => (ctx.body = { version: "1.0.0" }));
router.get("demo", "/demo", async ctx => (ctx.body = getDemo(ctx.query)));
router.get("/*", async ctx => (ctx.body = { error: 404 }));

export default router;
