import { prisma } from 'is-prisma';
import { Context } from 'koa';

import response from '../helpers/returnResponse';
import { getRequesterDecodedJWT } from './auth';

export const deleteServer = async (ctx: Context) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }
  const body = ctx.request.body;

  if (!body.server_id) {
    return response(ctx, 400);
  }

  await prisma.servers.deleteMany({
    where: {
      server_id: body.server_id,
      stack_id: { in: userJWT.roles?.update_stacks || [] },
    },
  });
  return response(ctx, 204);
};
