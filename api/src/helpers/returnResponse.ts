import { ContextProps } from '../types/commonTypes';
import { JsonObject } from 'type-fest';

const response = (
  ctx: ContextProps,
  statusCode: number,
  responseBody?: JsonObject | string
) => {
  ctx.status = statusCode;
  if (responseBody) ctx.body = responseBody;
};

export default response;
