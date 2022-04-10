import { Servers, Updates } from '@prisma/client';
import { prisma } from 'is-prisma';
import { Context } from 'koa';
import { JsonObject } from 'type-fest';

import checkForRequiredDataKeys from '../helpers/checkForRequiredDataKeys';
import isStackUpdating from '../helpers/isStackUpdating';
import response from '../helpers/returnResponse';
import { getRequesterDecodedJWT, getRequesterIdentity } from './auth';

export const updateGet = async (ctx: Context) => {
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
  const latestUpdate = await prisma.updates.findUnique({
    where: { id: Number(body.update_id) },
  });

  if (latestUpdate) {
    let responseBody = {
      ok: true,
      update_id: latestUpdate.id,
      is_cancelled: latestUpdate.is_cancelled,
      run_migrations: latestUpdate.run_migrations,
      update_app_to: latestUpdate.update_app_to,
      server_count: latestUpdate.server_count,
      server_ready_to_switch_count: latestUpdate.server_ready_to_switch_count,
      server_finished_count: latestUpdate.server_finished_count,
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

export const updateCreate = async (ctx: Context) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (!userJWT.roles) {
    return response(ctx, 202, []);
  }

  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = ['run_migrations', 'stack_ids', 'update_app_to'];
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

  const updateRequestedBy = getRequesterIdentity(ctx.request);

  for (const stack_id of body.stack_ids) {
    const stackId = Number(stack_id);

    if (!(userJWT.roles?.update_stacks || []).includes(stackId)) {
      return response(ctx, 401, {});
    }

    const lastUpdate = await prisma.updates.findFirst({
      where: { stack_id: stackId },
      orderBy: { id: 'desc' },
    });
    const isUpdating = isStackUpdating(lastUpdate);

    if (isUpdating) {
      continue;
    }

    const data = {
      update_requested_by: updateRequestedBy,
      last_update_id: lastUpdate?.id || null,
      stack_id: stackId,
      servers: [],
      servers_ready_to_switch: [],
      servers_finished: [],
      server_count: 0,
      server_ready_to_switch_count: 0,
      server_finished_count: 0,
      is_cancelled: false, // not in use

      run_migrations: body.run_migrations,

      update_app_to: body.update_app_to,

      chosen_one: '',
      switch_code_at_date: 0,
    } as Updates;

    await prisma.updates.create({
      data,
    });

    await prisma.servers.updateMany({
      where: { stack_id: stackId },
      data: {
        server_app_updating_to_version: body.update_app_to,
      },
    });
  }

  return response(ctx, 202, {});
};

export const updateServerProgress = async (ctx: Context) => {
  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = [
    'update_id',
    'server_id',
    'server_update_progress',
    'server_update_stage',
    'server_update_message',
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
  const latestUpdate = await prisma.updates.findUnique({
    where: { id: Number(body.update_id) },
  });

  if (!latestUpdate) {
    return response(ctx, 404, {
      ok: false,
      message: `'${body.update_id}' is not one of the latest updates.`,
    });
  }

  const responseBody = {} as JsonObject;

  switch (body.server_update_stage) {
    case 'election':
      if (!latestUpdate['servers'].includes(body.server_id)) {
        const doesChosenOneExist = latestUpdate['chosen_one'];

        await prisma.updates.update({
          where: { id: Number(body.update_id) },
          data: {
            servers: { push: body.server_id },
            server_count: {
              increment: 1,
            },
            ...(!doesChosenOneExist && { chosen_one: body.server_id }),
          },
        });
      }
      break;

    case 'installation':
      // We don't need to do anything special for this stage.
      // Server update below is required, so we don't quit out.
      break;

    case 'special':
      // We don't need to do anything special for this stage.
      // Server update below is required, so we don't quit out.
      break;

    case 'ready-to-switch':
      if (!latestUpdate['servers_ready_to_switch'].includes(body.server_id)) {
        const isServerChosenOne = latestUpdate['chosen_one'] === body.server_id;

        await prisma.updates.update({
          where: { id: Number(body.update_id) },
          data: {
            servers_ready_to_switch: { push: body.server_id },
            server_ready_to_switch_count: {
              increment: 1,
            },
            ...(isServerChosenOne && {
              switch_code_at_date: Math.floor(Date.now() / 1000) + 20,
            }),
          },
        });
      }
      break;

    case 'finished':
      if (!latestUpdate['servers_finished'].includes(body.server_id)) {
        await prisma.updates.update({
          where: { id: Number(body.update_id) },
          data: {
            servers_finished: { push: body.server_id },
            server_finished_count: {
              increment: 1,
            },
          },
        });
      }
      break;

    default:
      return response(ctx, 400, {
        ok: false,
        message: `No stage found with name: '${body.server_update_stage}'.`,
      });
  }

  const data = {
    server_id: body.server_id,
    server_update_stage: body.server_update_stage,
    server_update_progress: body.server_update_progress,
    server_update_message: body.server_update_message,
    ...(body.server_update_stage === 'finished' && {
      server_app_version: latestUpdate.update_app_to,
      server_updated_at: new Date(),
    }),
    server_app_updating_to_version: latestUpdate.update_app_to,
    server_is_chosen_one:
      body.server_id === latestUpdate.chosen_one ? true : false,
  } as Servers;

  await prisma.servers.update({
    where: { server_id: body.server_id },
    data,
  });

  responseBody.ok = true;

  return response(ctx, 200, responseBody);
};
