import prisma from '../../prisma/prismaClient';
import { logEvent } from './logs';
import groupBy from '../helpers/groupBy';
import response from '../helpers/returnResponse';
import { Server } from '@prisma/client';

export const deleteServer = async (ctx) => {
  const body = ctx.request.body;

  if (!body.server_id) {
    return response(ctx, 400);
  }
  await prisma.server.delete({ where: { server_id: body.server_id } });
  logEvent({ event: 'Server Deleted', payload: body.server_id });
  return response(ctx, 204);
};

export const getServers = async (ctx) => {
  const urlParams = ctx.query;

  if (urlParams.groupBy) {
    const groupByValue = urlParams.groupBy.toString();

    delete urlParams.groupBy;

    const stacks = await prisma.server.findMany({ where: urlParams });

    return response<{ [stackId: string]: Server[] }[]>(
      ctx,
      200,
      groupBy(stacks, (server) => server[groupByValue])
    );
  } else {
    const data = await prisma.server.findMany({ where: urlParams });
    return response<Server[]>(ctx, 200, data);
  }
};
