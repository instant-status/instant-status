import checkForRequiredDataKeys from '../helpers/checkForRequiredDataKeys';
import { getRequesterDecodedJWT } from './auth';
import response from '../helpers/returnResponse';
import prisma from '../../prisma/prismaClient';
import { makeJWTsStale } from '../helpers/jwt';

export const getUsers = async (ctx: any) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }

  const users = await prisma.users.findMany({
    include: {
      roles: true,
    },
  });

  return response(ctx, 200, users);
};

export const editUser = async (ctx) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }

  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = ['id', 'first_name', 'last_name', 'email', 'roles'];
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

  if (!Array.isArray(body.roles)) {
    return response(ctx, 400, {
      ok: false,
      message: "'roles' property is malformed, should be an array of role ids.",
    });
  }

  await prisma.users.update({
    where: { id: Number(body.id) },
    data: {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      roles: {
        set: body.roles.map((role: number) => ({ id: role })),
      },
    },
  });

  return response(ctx, 200, {
    ok: true,
    id: body.id,
  });
};

export const createUser = async (ctx) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }

  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = ['first_name', 'last_name', 'email', 'roles'];
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

  if (!Array.isArray(body.roles)) {
    return response(ctx, 400, {
      ok: false,
      message: "'roles' property is malformed, should be an array of role ids.",
    });
  }

  await prisma.users.create({
    data: {
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      roles: {
        connect: body.roles.map((role: number) => ({ id: role })),
      },
    },
  });

  // makeJWTsStale();
  return response(ctx, 202, {});
};

export const deleteUsers = async (ctx) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }

  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = ['user_ids'];
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

  if (!Array.isArray(body.user_ids)) {
    return response(ctx, 400, {
      ok: false,
      message:
        "'user_ids' property is malformed, should be an array of user ids.",
    });
  }

  await prisma.users.deleteMany({
    where: {
      id: { in: body.user_ids.map((id: number) => Number(id)) },
    },
  });

  // makeJWTsStale();
  return response(ctx, 202, {});
};
