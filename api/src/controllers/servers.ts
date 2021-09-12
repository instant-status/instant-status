import prisma from '../../prisma/prismaClient';
import response from '../helpers/returnResponse';

export const deleteServer = async (ctx) => {
  const body = ctx.request.body;

  if (!body.server_id) {
    return response(ctx, 400);
  }
  await prisma.servers.delete({ where: { server_id: body.server_id } });
  return response(ctx, 204);
};
