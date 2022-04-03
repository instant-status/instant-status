import { google } from 'googleapis';
import { API_CONFIG } from 'is-config';
import { prisma } from 'is-prisma';
import jwt from 'jsonwebtoken';
import { Context } from 'koa';

import constructUserStackPermissions from '../helpers/constructUserStackPermissions';
import formatAuthorisationToken from '../helpers/formatAuthorisationToken';
import { isJWTStale } from '../helpers/jwt';

const CLIENT_ID = API_CONFIG.GOOGLE_AUTH.CLIENT_ID;
const CLIENT_SECRET = API_CONFIG.GOOGLE_AUTH.CLIENT_SECRET;
const REDIRECT_URL = API_CONFIG.GOOGLE_AUTH.REDIRECT_URL;

export const isRequestAllowed = (request: {
  url: string;
  headers: { authorization?: string };
}) => {
  const isRequestFromServer =
    getRequesterIdentity(request) === `server@instantstatus.local`;

  // Don't require auth if user is trying to log in
  if (request.url.includes('/auth/google/callback')) {
    return true;
  }

  let isRequestAllowed = false;
  // Check if any of the provided tokens are valid JWTs
  API_CONFIG.APP_SECRETS.forEach((secret) => {
    try {
      // If none have been valid so far...
      if (!isRequestAllowed) {
        jwt.verify(
          formatAuthorisationToken(request.headers.authorization),
          secret
        );

        if (
          process.env.NODE_ENV === `development` ||
          isRequestFromServer ||
          !isJWTStale(request.headers.authorization)
        ) {
          isRequestAllowed = true;
        }
      }
    } catch (err) {
      // if this one isn't, check the rest
    }
  });

  return isRequestAllowed;
};

export const getRequesterDecodedJWT = (request: {
  headers: { authorization?: string };
}) => {
  const decodedJWT = jwt.decode(
    formatAuthorisationToken(request.headers.authorization)
  ) as {
    email: string;
    is_super_admin: boolean;
    roles: {
      view_stacks?: number[];
      update_stacks?: number[];
    };
  };

  return decodedJWT;
};

export const getRequesterIdentity = (request: any) => {
  const decodedJWT = getRequesterDecodedJWT(request);

  const requesterIdentity = decodedJWT?.email;

  return requesterIdentity;
};

export const checkUserValidityAndIssueNewJWT = async (options: {
  ctx: Context;
  emailsOveride?: string[];
}) => {
  const userEmails =
    options.emailsOveride ?? getRequesterIdentity(options.ctx.request);

  if (!userEmails) return false;

  const matchingUser = await prisma.users.findFirst({
    where: { email: { in: userEmails } },
    select: {
      id: true,
      email: true,
      is_super_admin: true,
      roles: {
        select: {
          view_stacks: {
            select: {
              id: true,
            },
          },
          view_stack_environments: true,
          update_stacks: {
            select: {
              id: true,
            },
          },
          update_stack_environments: true,
        },
      },
    },
  });

  if (!matchingUser) return false;

  const allStacks = await prisma.stacks.findMany({
    select: {
      id: true,
      environment: true,
    },
  });

  const userStackPermissions = constructUserStackPermissions({
    user: matchingUser,
    allStacks,
  });

  const validUser = {
    email: matchingUser.email,
    is_super_admin: matchingUser.is_super_admin,
    roles: {
      view_stacks: userStackPermissions.canViewStackIds,
      update_stacks: userStackPermissions.canUpdateStackIds,
    },
  };

  // console.log('Valid user:', validUser);

  const authCookie = jwt.sign(validUser, API_CONFIG.APP_SECRETS[0], {
    expiresIn: API_CONFIG.AUTH_VALID_FOR_SECONDS,
  });

  // Set a valid JWT in their cookie
  options.ctx.cookies.set(API_CONFIG.COOKIE_NAME, authCookie, {
    maxAge: 1000 * API_CONFIG.AUTH_VALID_FOR_SECONDS,
    httpOnly: false,
  });

  return true;
};

export const authGoogle = async (ctx: Context) => {
  try {
    const code = ctx.query.code.toString();
    if (!code) {
      throw new Error('No code passed');
    }

    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URL
    );
    // Get an access token based on our OAuth code
    const tokenData = await oAuth2Client.getToken(code);

    // console.log('Successfully authenticated');
    oAuth2Client.setCredentials(tokenData.tokens);

    const people = google.people({ version: 'v1', auth: oAuth2Client });

    const peopleResult = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses',
    });

    // Fetch emails from People result
    const emails = peopleResult.data.emailAddresses;
    if (emails.length === 0) {
      throw Error('No emails returned in peopleResult');
    }

    // console.log(emails);

    const userEmails = emails.map((user) => user.value);

    const checkUserValidityAndIssueNewJWTResult =
      await checkUserValidityAndIssueNewJWT({
        ctx,
        emailsOveride: userEmails,
      });
    if (checkUserValidityAndIssueNewJWTResult !== true)
      throw new Error('User not allowed');

    // Redirect them back to the home page with a valid JWT in their cookie
    ctx.body = `Redirecting to ${API_CONFIG.APP_NAME}...`;
    ctx.response.redirect(API_CONFIG.APP_URL);
    return;
  } catch (err) {
    console.log('Error in auth', err);
    ctx.body = 'Could not auth you: ' + err.message;
    ctx.response.status = 401;
    return;
  }
};
