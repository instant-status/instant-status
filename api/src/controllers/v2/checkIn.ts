import db from 'diskdb';

import ALLOWED_DATA, { AllowedDataType } from '../../../../config/allowedData';
import response from '../../helpers/returnResponse';

export const checkIn = (ctx) => {
  // Ensuring we have required data in the request
  const body = ctx.request.body;
  if (!body.server_id || !body.stack_id) {
    return response(ctx, 400);
  }

  // Fetching the details of the latest update for the Stack and returning a response
  const latestUpdate = db.updates.findOne({ stack_id: body.stack_id });
  console.log(latestUpdate);
  const updateIsAvailable =
    !latestUpdate.servers.includes(body.server_id) &&
    latestUpdate.update_id !== body.last_update_id;
  const responseBody = {
    ok: true,
    update_available: updateIsAvailable,
  };

  // Save latest server information
  const payloadItems = Object.entries(body);
  const data = {};

  payloadItems.forEach((item) => {
    // If the payload item key exists in the ALLOWED_DATA array, save it
    if (ALLOWED_DATA.includes(item[0] as AllowedDataType)) {
      data[item[0]] = item[1];
    }
  });

  db.instances.update({ server_id: body.server_id }, data, {
    upsert: true,
  });

  return response(ctx, 200, responseBody);
};
