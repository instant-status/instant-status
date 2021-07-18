import { JsonObject } from 'type-fest';
import checkForRequiredDataKeys from '../helpers/checkForRequiredDataKeys';
import { getRequesterIdentity } from './auth';
import groupBy from '../helpers/groupBy';
import response from '../helpers/returnResponse';
import isStackUpdating from '../helpers/isStackUpdating';
import prisma from '../../prisma/prismaClient';
import { Servers, Updates } from '@prisma/client';

export const updateGet = async (ctx) => {
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
  const latestUpdate = await prisma.updates.findFirst({
    where: { id: Number(body.update_id) },
    orderBy: { id: 'desc' },
  });

  if (latestUpdate) {
    let responseBody = {
      ok: true,
      update_id: latestUpdate.id,
      is_cancelled: latestUpdate.is_cancelled,
      run_migrations: latestUpdate.run_migrations,
      rollback_migrations: latestUpdate.rollback_migrations,
      update_app_to: latestUpdate.update_app_to,
      update_xapi_to: latestUpdate.update_xapi_to,
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

export const updateCreate = async (ctx) => {
  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = [
    'run_migrations',
    'stack_ids',
    'update_app_to',
    'update_xapi_to',
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

  const updateRequestedBy = getRequesterIdentity(ctx.request);

  for (const stack_id of body.stack_ids) {
    const lastUpdate = await prisma.updates.findFirst({
      where: { stack_id: stack_id },
      orderBy: { id: 'desc' },
    });
    const isUpdating = isStackUpdating(lastUpdate);

    if (isUpdating) {
      continue;
    }

    const data = {
      update_requested_by: updateRequestedBy,
      last_update_id: lastUpdate?.id || null,
      stack_id: stack_id,
      servers: [],
      servers_ready_to_switch: [],
      servers_finished: [],
      server_count: 0,
      server_ready_to_switch_count: 0,
      server_finished_count: 0,
      is_cancelled: false, // not in use

      run_migrations: body.run_migrations,
      rollback_migrations: false, // not in use

      update_app_to: body.update_app_to,
      update_xapi_to: body.update_xapi_to,

      chosen_one: '',
      switch_code_at_date: 0,
    } as Updates;

    await prisma.updates.create({
      data,
    });

    await prisma.servers.updateMany({
      where: { stack_id: stack_id },
      data: {
        server_app_updating_to_version: body.update_app_to,
        server_xapi_updating_to_version: body.update_xapi_to,
      },
    });
  }

  return response(ctx, 202, {});
};

export const updatePost = async (ctx) => {
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
  const latestUpdate = await prisma.updates.findFirst({
    where: { id: Number(body.update_id) },
    orderBy: { id: 'desc' },
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
        const serverIdsCount = latestUpdate['servers'].length;
        if (serverIdsCount < 1) {
          latestUpdate['chosen_one'] = body.server_id;
        }
        latestUpdate['servers'].push(body.server_id);
        latestUpdate['server_count'] = serverIdsCount + 1;
      }

      await prisma.updates.update({
        where: { id: Number(body.update_id) },
        data: latestUpdate,
      });
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
        latestUpdate['servers_ready_to_switch'].push(body.server_id);
        latestUpdate['server_ready_to_switch_count'] += 1;
      }

      if (latestUpdate['chosen_one'] === body.server_id) {
        latestUpdate['switch_code_at_date'] =
          Math.floor(Date.now() / 1000) + 20;
      }

      await prisma.updates.update({
        where: { id: Number(body.update_id) },
        data: latestUpdate,
      });
      break;

    case 'finished':
      if (!latestUpdate['servers_finished'].includes(body.server_id)) {
        latestUpdate['servers_finished'].push(body.server_id);
        latestUpdate['server_finished_count'] += 1;
      }

      await prisma.updates.update({
        where: { id: Number(body.update_id) },
        data: latestUpdate,
      });
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
      server_xapi_version: latestUpdate.update_xapi_to,
      server_updated_at: new Date(),
    }),
    server_app_updating_to_version: latestUpdate.update_app_to,
    server_xapi_updating_to_version: latestUpdate.update_xapi_to,
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

export const getStacksAvailableForUpdate = async (ctx: any) => {
  const servers = await prisma.servers.findMany();

  const output = {};

  for (const server of servers) {
    const update = await prisma.updates.findFirst({
      where: { stack_id: server.stack_id },
      orderBy: { id: 'desc' },
    });

    const isUpdating = isStackUpdating(update);

    output[server.stack_id] = {
      stack_id: server.stack_id,
      stack_app_version_display: isUpdating
        ? update.update_app_to
        : server.server_app_version,
      stack_xapi_version_display: isUpdating
        ? update.update_xapi_to
        : server.server_xapi_version,
      stack_environment: server.stack_environment,
      stack_is_updating: isUpdating,
    };
  }

  const stackInfo = Object.values(output);

  const responseBody = Object.entries(
    groupBy(stackInfo, (data) => data.stack_environment)
  ) as any;

  return response(ctx, 200, responseBody);
};

export const getUpdatingStacks = async (ctx: any) => {
  const servers = await prisma.servers.findMany();
  const updates = await prisma.updates.findMany();

  const updatingStacks = new Set<string>();
  const startingUpdateStacks = new Set<string>();

  for (const update of updates) {
    if (update.server_count === 0) {
      updatingStacks.add(update.stack_id);
      startingUpdateStacks.add(update.stack_id);
    }
  }

  for (const server of servers) {
    if (server.server_update_progress !== 100) {
      updatingStacks.add(server.stack_id);
    }
  }

  return response(ctx, 200, {
    updatingStacks: [...updatingStacks],
    startingUpdateStacks: [...startingUpdateStacks],
  });
};