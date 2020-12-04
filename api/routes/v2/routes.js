import KoaRouter from "@koa/router";
import {
  checkIn
} from "../../controllers/v2/checkIn";

const routerV2 = new KoaRouter({
  prefix: '/v2'
});

// Home
routerV2.get("/", ctx => (ctx.body = { version: "2.0.0" }));

// Check-in
routerV2.post("/check-in", checkIn);

export {
  routerV2
};
