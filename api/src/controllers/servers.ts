import db from 'diskdb';
import { logEvent } from './logs';
import groupBy from '../helpers/groupBy';
import response from '../helpers/returnResponse';

export const deleteServer = (ctx) => {
  const body = ctx.request.body;

  if (!body.server_id) {
    return response(ctx, 400);
  }
  db.servers.remove({ server_id: body.server_id }, true);
  logEvent({ event: 'Server Deleted', payload: body.server_id });
  return response(ctx, 204);
};

export const getServers = (ctx) => {
  const urlParams = ctx.query;

  if (urlParams.groupBy) {
    const groupByValue = urlParams.groupBy.toString();

    delete urlParams.groupBy;

    const stacks = db.servers.find(urlParams);

    return response(
      ctx,
      200,
      groupBy(stacks, (server) => server[groupByValue])
    );
  } else {
    return response(ctx, 200, db.servers.find(urlParams));
  }
};
