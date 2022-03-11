import Koa from "koa";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import bearerToken from "koa-bearer-token";
import cors from "@koa/cors";

import dayjs from "dayjs";
import db from "diskdb";
import dotenv from "dotenv";
import utc from "dayjs/plugin/utc";

import appRoutes from "./routes/routes";
import { isRequestAllowed } from "./controllers/auth";
import { APP_CONFIG } from "../appConfig";

const app = new Koa();

dayjs.extend(utc);
dotenv.config();

app.use(cors());
app.use(json());
app.use(bodyParser());
app.use(bearerToken());

app.use((ctx, next) => {
  if (isRequestAllowed(ctx.request)) {
    return next();
  } else {
    ctx.status = 401;
    ctx.body = [];
  }
});

db.connect("../data/", ["instances"]);

app.use(appRoutes.routes()).use(appRoutes.allowedMethods());

const port = APP_CONFIG.PORT || 3000;
app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);

let runMonitor = false;

const monitor = () => {
  if (runMonitor) {
    console.log(`[${dayjs.utc()}] Running monitor`);

    const allInstances = db.instances.find({});
    const truantInstances = allInstances.filter((instance) => {
      if (instance.instanceLastHealthyAt === undefined) return false;
      return (
        dayjs.utc(instance.instanceLastHealthyAt).toDate() <
        dayjs.utc().subtract(5, "minutes").toDate()
      );
    });

    if (truantInstances.length > 0) {
      const truantInstanceIds = truantInstances.map(
        (instance) => instance.instanceID
      );

      truantInstanceIds.forEach((truantInstanceId) => {
        db.instances.remove({ instanceID: truantInstanceId }, true);
      });

      console.log(
        "🚮 Deleted the following truant instances:",
        truantInstances.map((truantInstance) => {
          return {
            _id: truantInstance._id,
            instanceID: truantInstance.instanceID,
            instanceLastHealthyAt: truantInstance.instanceLastHealthyAt,
            stackName: truantInstance.stackName,
          };
        })
      );
    }
  } else {
    console.log("Skipping monitor");
  }
};

setInterval(monitor, 1 * 60 * 1000);
setTimeout(() => {
  runMonitor = true;
}, 2 * 60 * 1000);
