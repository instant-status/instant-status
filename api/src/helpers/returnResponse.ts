import { ContextProps } from '../types/commonTypes';
import { JsonObject } from 'type-fest';

const response = <T>(
  ctx: ContextProps<T>,
  statusCode: number,
  responseBody?: JsonObject | string | T
) => {
  ctx.status = statusCode;
  if (responseBody) ctx.body = responseBody;
};

export default response;
