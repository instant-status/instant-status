import db from 'diskdb';
import { ServerProps } from '../../../types/globalTypes';
import response from '../helpers/returnResponse';

export const getMetadata = (ctx: any) => {
  const servers = db.servers.find() as ServerProps[];
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
