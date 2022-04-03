import { prisma } from 'is-prisma';
import { Context } from 'koa';

import response from '../helpers/returnResponse';
import { getRequesterDecodedJWT } from './auth';

export const getMetadata = async (ctx: Context) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (!userJWT.roles) {
    return response(ctx, 202, {
      isSuperAdmin: false,
      activeVersions: [],
      serverCount: 0,
      stackCount: 0,
      stacks: [],
      maxServerCount: 0,
      maxDisplayCount: 3,
    });
  }

  const servers = await prisma.servers.findMany({
    where: { stack_id: { in: userJWT.roles?.view_stacks || [] } },
  });

  const stacks = new Set(servers.map((server) => server.stack_id));
  const versions = new Set(servers.map((server) => server.server_app_version));

  const stacksWithServerCount = await prisma.servers.groupBy({
    by: ['stack_id'],
    _count: true,
  });

  const maxDisplayCount =
    stacksWithServerCount.sort((a, b) => b?._count - a?._count)?.[0]?._count ||
    0;

  const responseBody = {
    isSuperAdmin: userJWT.is_super_admin,
    activeVersions: [...versions],
    serverCount: servers.length,
    stackCount: [...stacks].length,
    stacks: [...stacks],
    maxServerCount: 3,
    maxDisplayCount: maxDisplayCount < 3 ? 3 : maxDisplayCount,
  };

  return response(ctx, 200, responseBody);
};
