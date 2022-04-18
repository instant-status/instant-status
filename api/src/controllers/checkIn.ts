import { Servers } from '@prisma/client';
import { ALLOWED_DATA, AllowedDataType } from 'is-config';
import { prisma } from 'is-prisma';
import { Context } from 'koa';

import checkForRequiredDataKeys from '../helpers/checkForRequiredDataKeys';
import response from '../helpers/returnResponse';

export const checkIn = async (ctx: Context) => {
  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = ['server_id', 'stack_id', 'last_update_id'];
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

  body.stack_id = Number(body.stack_id) || null;
  body.last_update_id = Number(body.last_update_id) || null;

  if (!body.stack_id) {
    return response(ctx, 404, {
      ok: false,
      message: `'${body.stack_id}' is not a known Stack.`,
    });
  }

  // Fetching the details of the latest update for the Stack and returning a response
  const stack = await prisma.stacks.findUnique({
    where: { id: body.stack_id },
    include: {
      servers: true,
      updates: {
        where: { is_cancelled: false },
        orderBy: { id: 'desc' },
        take: 1,
      },
    },
  });

  if (!stack) {
    return response(ctx, 404, {
      ok: false,
      message: `'${body.stack_id}' is not a known Stack.`,
    });
  }

  const latestUpdate = stack.updates?.[0];
  const updateIsAvailable =
    Boolean(latestUpdate) &&
    !latestUpdate.servers.includes(body.server_id) &&
    latestUpdate.id !== body.last_update_id;

  const responseBody = {
    ok: true,
    update_available: updateIsAvailable,
    update_id: latestUpdate?.id,
  };

  if (!latestUpdate) {
    return response(ctx, 200, responseBody);
  }

  // Save latest server information
  const payloadItems = Object.entries(body);
  const data = {} as Servers;

  payloadItems.forEach((item) => {
    // If the payload item key exists in the ALLOWED_DATA array, save it
    if (ALLOWED_DATA.includes(item[0] as AllowedDataType)) {
      data[item[0]] = item[1];
    }
  });

  if (body.is_slim_check_in === true) {
    try {
      await prisma.servers.update({
        where: { server_id: body.server_id },
        data: data,
      });
    } catch (err) {
      console.warn(err);
    }
  } else {
    try {
      await prisma.servers.upsert({
        where: { server_id: body.server_id },
        create: data,
        update: data,
      });
    } catch (err) {
      console.warn(err);
    }

    const isServerChosenOne = Boolean(
      stack.servers.find(
        (server) =>
          server.server_id === body.server_id && server.server_is_chosen_one
      )
    );

    if (isServerChosenOne) {
      await prisma.stacks.update({
        where: { id: Number(body.stack_id) },
        data: {
          logs_url: body.stack_logs_url,
          logo_url: body.stack_logo_url,
          app_url: body.stack_app_url,
          region: body.stack_region,
          environment: body.stack_environment,
        },
      });
    }
  }

  return response(ctx, 200, responseBody);
};
