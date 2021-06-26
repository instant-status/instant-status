import db from 'diskdb';
import { logEvent } from './logs';
import groupBy from '../helpers/groupBy';
import response from '../helpers/returnResponse';

export const deleteInstance = (ctx) => {
  const body = ctx.request.body;

  if (!body.server_id) {
    return response(ctx, 400);
  }
  db.instances.remove({ server_id: body.server_id }, true);
  logEvent({ event: 'Instance Deleted', payload: body.server_id });
  return response(ctx, 204);
};

export const getInstances = (ctx) => {
  const urlParams = ctx.query;

  if (urlParams.groupBy) {
    const groupByValue = urlParams.groupBy.toString();

    delete urlParams.groupBy;

    const stacks = db.instances.find(urlParams);

    return response(
      ctx,
      200,
      groupBy(stacks, (instance) => instance[groupByValue])
    );
  } else {
    return response(ctx, 200, db.instances.find(urlParams));
  }
};
