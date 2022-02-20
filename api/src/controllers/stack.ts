import checkForRequiredDataKeys from '../helpers/checkForRequiredDataKeys';
import { getRequesterDecodedJWT, getRequesterIdentity } from './auth';
import response from '../helpers/returnResponse';
import prisma from '../../prisma/prismaClient';
import { Updates } from '@prisma/client';

export const getAvailableStacksAndEnvironments = async (ctx) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 202, []);
  }

  const stackList = await prisma.stacks.findMany({
    orderBy: { id: 'desc' },
    select: { id: true, name: true, environment: true },
  });

  const availableEnvironments = new Set();

  for (const stack of stackList) {
    availableEnvironments.add(stack.environment);
  }

  const availableStacks = stackList.map((stack) => ({
    id: stack.id,
    name: stack.name,
  }));

  return response(ctx, 202, {
    availableStacks,
    availableEnvironments: Array.from(availableEnvironments),
  });
};

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

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }

  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = [
    'name',
    'run_migrations',
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

  try {
    const stack = await prisma.stacks.create({
      data: { name: body.name.toLowerCase() },
    });

    const data = {
      update_requested_by: updateRequestedBy,
      last_update_id: null,
      stack_id: stack.id,
      servers: [],
      servers_ready_to_switch: [],
      servers_finished: [],
      server_count: 0,
      server_ready_to_switch_count: 0,
      server_finished_count: 0,
      is_cancelled: false, // not in use

      run_migrations: body.run_migrations,

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
  } catch (err) {
    console.log(err);
    return response(ctx, 400, {
      ok: false,
      message: 'Something went wrong.',
    });
  }

  // makeJWTsStale();
  return response(ctx, 202, {});
};

export const deleteStacks = async (ctx) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }

  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = ['stack_ids'];
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

  if (!Array.isArray(body.stack_ids)) {
    return response(ctx, 400, {
      ok: false,
      message:
        "'stack_ids' property is malformed, should be an array of stack ids.",
    });
  }

  try {
    await prisma.servers.deleteMany({
      where: {
        stack_id: { in: body.stack_ids.map((id: number) => Number(id)) },
      },
    });

    await prisma.updates.deleteMany({
      where: {
        stack_id: { in: body.stack_ids.map((id: number) => Number(id)) },
      },
    });

    await prisma.stacks.deleteMany({
      where: {
        id: { in: body.stack_ids.map((id: number) => Number(id)) },
      },
    });
  } catch (err) {
    console.log(err);
    return response(ctx, 400, {
      ok: false,
      message: 'Something went wrong.',
    });
  }

  // makeJWTsStale();
  return response(ctx, 202, {});
};
