import { Servers } from '@prisma/client';
import ALLOWED_DATA, { AllowedDataType } from '../../../config/allowedData';
import prisma from '../../prisma/prismaClient';
import checkForRequiredDataKeys from '../helpers/checkForRequiredDataKeys';
import response from '../helpers/returnResponse';

export const checkIn = async (ctx) => {
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

  // Fetching the details of the latest update for the Stack and returning a response
  const latestUpdate = await prisma.updates.findFirst({
    where: { stack_id: body.stack_id },
    orderBy: { id: 'desc' },
  });

  if (!latestUpdate) {
    return response(ctx, 404, {
      ok: false,
      message: `'${body.stack_id}' is not a known Stack.`,
    });
  }

  const updateIsAvailable =
    !latestUpdate.servers.includes(body.server_id) &&
    latestUpdate.id !== body.last_update_id;
  const responseBody = {
    ok: true,
    update_available: updateIsAvailable,
    update_id: latestUpdate.id,
  };

  // Save latest server information
  const payloadItems = Object.entries(body);
  const data = {} as Servers;

  payloadItems.forEach((item) => {
    // If the payload item key exists in the ALLOWED_DATA array, save it
    if (ALLOWED_DATA.includes(item[0] as AllowedDataType)) {
      data[item[0]] = item[1];
    }
  });

  data.last_update_id = Number(data.last_update_id) || null;

  await prisma.servers.upsert({
    where: { server_id: body.server_id },
    create: data,
    update: data,
  });

  return response(ctx, 200, responseBody);
};
