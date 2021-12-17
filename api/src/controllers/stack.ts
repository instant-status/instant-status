import checkForRequiredDataKeys from '../helpers/checkForRequiredDataKeys';
import { getRequesterDecodedJWT, getRequesterIdentity } from './auth';
import response from '../helpers/returnResponse';
import isStackUpdating from '../helpers/isStackUpdating';
import prisma from '../../prisma/prismaClient';
import { Updates } from '@prisma/client';
import { makeJWTsStale } from '../helpers/jwt';

export const listStacks = async (ctx) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (!userJWT.roles) {
    return response(ctx, 202, []);
  }

  const stackList = await prisma.stacks.findMany({
    orderBy: { id: 'desc' },
    include: { servers: true, updates: { orderBy: { created_at: 'desc' } } },
    where: { id: { in: userJWT.roles?.view_stacks || [] } },
  });

  for (const stack of stackList) {
    // @ts-ignore
    stack.canUpdate = (userJWT.roles?.update_stacks || []).includes(stack.id);
  }

  return response(ctx, 202, stackList || []);
};

export const getIdByName = async (ctx) => {
  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = ['stack_name'];
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

  const stack = await prisma.stacks.findUnique({
    where: { name: `${body.stack_name}` },
    select: { id: true },
  });

  if (!stack) {
    return response(ctx, 404, {
      ok: false,
      message: `'${body.stack_name}' is not a known Stack.`,
    });
  }

  return response(ctx, 200, {
    ok: true,
    id: stack.id,
  });
};

export const createStack = async (ctx) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (!userJWT.is_super_admin) {
    return response(ctx, 401, {});
  }

  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = [
    'run_migrations',
    'stack_names',
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

  for (const stack_name of body.stack_names) {
    const stack = await prisma.stacks.create({
      data: { name: stack_name.toLowerCase() },
    });

    const lastUpdate = await prisma.updates.findFirst({
      where: { stack_id: stack.id },
      orderBy: { id: 'desc' },
    });
    const isUpdating = isStackUpdating(lastUpdate);

    if (isUpdating) {
      continue;
    }

    const data = {
      update_requested_by: updateRequestedBy,
      last_update_id: lastUpdate?.id || null,
      stack_id: stack.id,
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
      where: { stack_id: stack.id },
      data: {
        server_app_updating_to_version: body.update_app_to,
        server_xapi_updating_to_version: body.update_xapi_to,
      },
    });
  }

  makeJWTsStale();
  return response(ctx, 202, {});
};

export const deleteStack = async (ctx) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (!userJWT.is_super_admin) {
    return response(ctx, 401, {});
  }

  console.log('todo');
};