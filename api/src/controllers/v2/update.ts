import db from 'diskdb';
import { JsonObject } from 'type-fest';

import ALLOWED_DATA, { AllowedDataType } from '../../../../allowedData';
import checkForRequiredDataKeys from '../../helpers/checkForRequiredDataKeys';
import response from '../../helpers/returnResponse';

export const updateGet = (ctx) => {
  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = ['update_id'];
  const checkForRequiredDataKeysResult = checkForRequiredDataKeys(
    body,
    requiredDataKeys
  );
  if (checkForRequiredDataKeysResult.hasAllRequiredDataKeys === false) {
    return response(ctx, 400, {
      ok: false,
      message: checkForRequiredDataKeysResult.message,
    });
  }

  // Fetching the details of the update and returning a response
  const latestUpdate = db.updates.findOne({ update_id: body.update_id });

  if (latestUpdate) {
    let responseBody = {
      ok: true,
      update_id: latestUpdate.update_id,
      is_cancelled: latestUpdate.is_cancelled,
      update_configs: latestUpdate.update_configs,
      update_envs: latestUpdate.update_envs,
      run_migrations: latestUpdate.run_migrations,
      rollback_migrations: latestUpdate.rollback_migrations,
      update_app_to: latestUpdate.update_app_to,
      update_xapi_to: latestUpdate.update_xapi_to,
      instances_count: latestUpdate.instances_count,
      finished_installation_count: latestUpdate.finished_installation_count,
    } as JsonObject;

    if (latestUpdate.chosen_one) {
      responseBody.chosen_one = latestUpdate.chosen_one;
    }
    if (latestUpdate.switch_code_at_date) {
      responseBody.switch_code_at_date = latestUpdate.switch_code_at_date;
    }

    return response(ctx, 200, responseBody);
  } else {
    return response(ctx, 404, {
      ok: false,
      message: `No update found with id: '${body.update_id}'.`,
    });
  }
};

export const updatePost = (ctx) => {
  // Ensuring we have required data in the request
  const body = ctx.request.body;
  if (!body.instance_id || !body.stack_id) {
    return response(ctx, 400);
  }

  // Fetching the details of the latest update for the Stack and returning a response
  const latestUpdate = db.updates.findOne({ stack_id: body.stack_id });
  console.log(latestUpdate);
  const updateIsAvailable =
    !latestUpdate.instance_ids.includes(body.instance_id) ||
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

  db.instances.update({ instance_id: body.instance_id }, data, {
    upsert: true,
  });

  return response(ctx, 200, responseBody);
};
