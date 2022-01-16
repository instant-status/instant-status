import prisma from '../../prisma/prismaClient';
import response from '../helpers/returnResponse';
import { getRequesterDecodedJWT } from './auth';

export const getUsers = async (ctx: any) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (!userJWT.roles) {
    return response(ctx, 401, []);
  }

  const users = await prisma.users.findMany({
    include: {
      roles: true,
    },
  });

  return response(ctx, 200, users);
};

export const getRoles = async (ctx: any) => {
  const userJWT = getRequesterDecodedJWT(ctx.request);

  if (!userJWT.roles) {
    return response(ctx, 401, []);
  }

  const roles = await prisma.roles.findMany({
    include: {
      update_stacks: {
        select: {
          id: true,
          name: true,
        },
      },
      view_stacks: {
        select: {
          id: true,
          name: true,
        },
      },
      usersWithThisRole: true,
    },
  });

  return response(ctx, 200, roles);
};
