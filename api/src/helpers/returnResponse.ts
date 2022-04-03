import { Context } from 'koa';
import { JsonObject } from 'type-fest';

const response = <T>(
  ctx: Context,
  statusCode: number,
  responseBody?: JsonObject | string | T
) => {
  ctx.status = statusCode;
  if (responseBody) ctx.body = responseBody;
};

export default response;
