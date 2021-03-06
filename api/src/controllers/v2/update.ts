import db from 'diskdb';
import { JsonObject } from 'type-fest';
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
      server_count: latestUpdate.server_count,
      server_completed_count: latestUpdate.server_completed_count,
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
      message: `'${body.update_id}' is not one of the latest updates.`,
    });
  }
};

export const updatePost = (ctx) => {
  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = [
    'message',
    'progress',
    'server_id',
    'stage',
    'update_id',
  ];
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

  // Fetching the details of the given update and returning a response
  const latestUpdate = db.updates.findOne({ update_id: body.update_id });
  if (!latestUpdate) {
    return response(ctx, 404, {
      ok: false,
      message: `'${body.update_id}' is not one of the latest updates.`,
    });
  }

  const responseBody = {} as JsonObject;

  switch (body.stage) {
    case 'election':
      if (!latestUpdate['servers'].includes(body.server_id)) {
        const serverIdsCount = latestUpdate['servers'].length;
        if (serverIdsCount < 1) {
          latestUpdate['chosen_one'] = body.server_id;
        }
        latestUpdate['servers'].push(body.server_id);
        latestUpdate['server_count'] = serverIdsCount + 1;
      }
      db.updates.update({ update_id: body.update_id }, latestUpdate);
      break;

    case 'installation':
      // We don't need to do anything special for this stage.
      // Server update below is required, so we don't quit out.
      break;

    case 'special':
      // We don't need to do anything special for this stage.
      // Server update below is required, so we don't quit out.
      break;

    case 'completion':
      if (!latestUpdate['servers_completed'].includes(body.server_id)) {
        latestUpdate['servers_completed'].push(body.server_id);
        latestUpdate['server_completed_count'] += 1;
      }

      if (latestUpdate['chosen_one'] === body.server_id) {
        latestUpdate['switch_code_at_date'] =
          Math.floor(Date.now() / 1000) + 20;
      }

      db.updates.update({ update_id: body.update_id }, latestUpdate);
      break;

    case 'finished':
      // We don't need to do anything special for this stage.
      // Server update below is required, so we don't quit out.
      break;

    default:
      return response(ctx, 400, {
        ok: false,
        message: `No stage found with name: '${body.stage}'.`,
      });
  }

  db.instances.update(
    {
      server_id: body.server_id,
    },
    {
      server_id: body.server_id,
      update_progress: body.progress,
      update_stage: body.stage,
      update_message: body.message,
    },
    { upsert: true }
  );

  responseBody.ok = true;

  return response(ctx, 200, responseBody);
};
