import prisma from '../../prisma/prismaClient';
import response from '../helpers/returnResponse';

export const getMetadata = async (ctx: any) => {
  const servers = await prisma.server.findMany();

  const stacks = new Set(servers.map((server) => server.stack_id));
  const versions = new Set(servers.map((server) => server.server_app_version));

  const responseBody = {
    activeVersions: [...versions],
    serverCount: servers.length,
    stackCount: [...stacks].length,
    stacks: [...stacks],
    maxServerCount: 3,
  };

  return response(ctx, 200, responseBody);
};
