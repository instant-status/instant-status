const response = (ctx: any, statusCode: number, responseBody?: any) => {
  ctx.status = statusCode;
  if (responseBody) ctx.body = responseBody;
};

export default response;
