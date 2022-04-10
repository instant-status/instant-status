import { Roles, Stacks } from '@prisma/client';
import { prisma } from 'is-prisma';
import { Context } from 'koa';

import checkForRequiredDataKeys from '../helpers/checkForRequiredDataKeys';
import { makeJWTsStale } from '../helpers/jwt';
import response from '../helpers/returnResponse';
import {
  checkUserValidityAndIssueNewJWT,
  getRequesterDecodedJWT,
} from './auth';

export const getRoles = async (ctx: Context) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }

  const roles = await prisma.roles.findMany({
    include: {
      view_stacks: {
        select: {
          id: true,
          name: true,
        },
      },
      update_stacks: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          usersWithThisRole: true,
        },
      },
    },
  });

  return response(ctx, 200, roles);
};

interface EditRolePayload extends Roles {
  view_stacks: Stacks;
  update_stacks: Stacks;
}

export const editRole = async (ctx: Context) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }

  // Ensuring we have required data in the request
  const body = ctx.request.body as EditRolePayload;
  const requiredDataKeys = [
    'id',
    'name',
    'view_stacks',
    'update_stacks',
    'view_stack_environments',
    'update_stack_environments',
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

  if (
    !Array.isArray(body.view_stacks) ||
    !Array.isArray(body.update_stacks) ||
    !Array.isArray(body.view_stack_environments) ||
    !Array.isArray(body.update_stack_environments)
  ) {
    return response(ctx, 400, {
      ok: false,
      message:
        "One or more of 'view_stacks', 'update_stacks', 'view_stack_environments', and 'update_stack_environments' is malformed. Expected an array for each.",
    });
  }

  await prisma.roles.update({
    where: { id: Number(body.id) },
    data: {
      name: body.name,
      view_stacks: {
        set: body.view_stacks.map((stack: number) => ({ id: stack })),
      },
      update_stacks: {
        set: body.update_stacks.map((stack: number) => ({ id: stack })),
      },
      view_stack_environments: body.view_stack_environments,
      update_stack_environments: body.update_stack_environments,
    },
  });

  makeJWTsStale();
  const checkUserValidityAndIssueNewJWTResult =
    await checkUserValidityAndIssueNewJWT({ ctx });
  if (checkUserValidityAndIssueNewJWTResult !== true)
    return response(ctx, 401, {});

  return response(ctx, 200, {
    ok: true,
    id: body.id,
  });
};

export const createRole = async (ctx: Context) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }

  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = [
    'name',
    'view_stacks',
    'update_stacks',
    'view_stack_environments',
    'update_stack_environments',
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

  if (
    !Array.isArray(body.view_stacks) ||
    !Array.isArray(body.update_stacks) ||
    !Array.isArray(body.view_stack_environments) ||
    !Array.isArray(body.update_stack_environments)
  ) {
    return response(ctx, 400, {
      ok: false,
      message:
        "One or more of 'view_stacks', 'update_stacks', 'view_stack_environments', and 'update_stack_environments' is malformed. Expected an array for each.",
    });
  }

  await prisma.roles.create({
    data: {
      name: body.name,
      view_stacks: {
        connect: body.view_stacks.map((stack: number) => ({ id: stack })),
      },
      update_stacks: {
        connect: body.update_stacks.map((stack: number) => ({ id: stack })),
      },
      view_stack_environments: body.view_stack_environments,
      update_stack_environments: body.update_stack_environments,
    },
  });

  makeJWTsStale();
  const checkUserValidityAndIssueNewJWTResult =
    await checkUserValidityAndIssueNewJWT({ ctx });
  if (checkUserValidityAndIssueNewJWTResult !== true)
    return response(ctx, 401, {});

  return response(ctx, 202, {});
};

export const deleteRoles = async (ctx: Context) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (userJWT.is_super_admin !== true) {
    return response(ctx, 401, {});
  }

  // Ensuring we have required data in the request
  const body = ctx.request.body;
  const requiredDataKeys = ['role_ids'];
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

  if (!Array.isArray(body.role_ids)) {
    return response(ctx, 400, {
      ok: false,
      message:
        "'role_ids' property is malformed, should be an array of role ids.",
    });
  }

  await prisma.roles.deleteMany({
    where: {
      id: { in: body.role_ids.map((id: number) => Number(id)) },
    },
  });

  makeJWTsStale();
  const checkUserValidityAndIssueNewJWTResult =
    await checkUserValidityAndIssueNewJWT({ ctx });
  if (checkUserValidityAndIssueNewJWTResult !== true)
    return response(ctx, 401, {});

  return response(ctx, 202, {});
};
