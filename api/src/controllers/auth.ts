import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import APP_CONFIG from '../../../config/appConfig';
import API_CONFIG from '../../../config/apiConfig';
import formatAuthorisationToken from '../helpers/formatAuthorisationToken';

const CLIENT_ID = API_CONFIG.GOOGLE_AUTH.CLIENT_ID;
const CLIENT_SECRET = API_CONFIG.GOOGLE_AUTH.CLIENT_SECRET;
const REDIRECT_URL = API_CONFIG.GOOGLE_AUTH.REDIRECT_URL;
const AUTH_VALID_FOR_SECONDS = 60 * 60 * 1; // 1 hour

export const isRequestAllowed = (request: {
  url: string;
  headers: { authorization?: string };
}) => {
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

        isRequestAllowed = true;
      }
    } catch (err) {
      // if this one isn't, check the rest
    }
  });

  return isRequestAllowed;
};

export const getRequesterIdentity = (request: {
  url: string;
  headers: { authorization?: string };
}) => {
  const decodedJWT = jwt.decode(
    formatAuthorisationToken(request.headers.authorization)
  ) as { emails: string[] };

  const requesterIdentity =
    decodedJWT?.emails?.[0] || 'unknown.user@example.com';

  return requesterIdentity;
};

export const authGoogle = async (ctx: any) => {
  try {
    const code = ctx.query.code;
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

    // Go get valid emails with roles
    const validUsers = emails.reduce(
      (curr, emailData) => {
        const email = emailData.value;
        // console.log(`Checking if ${email} is valid...`);
        if (API_CONFIG.ALLOWED_USERS[email]) {
          curr.emails.push(email);
          curr.roles = [
            ...curr.roles,
            ...API_CONFIG.ALLOWED_USERS[email].roles,
          ];
        }
        return curr;
      },
      {
        emails: [],
        roles: [],
      }
    );
    // console.log('Valid emails:', validUsers);

    if (validUsers.emails.length === 0) {
      throw new Error('User not allowed');
    }

    const authCookie = jwt.sign(validUsers, API_CONFIG.APP_SECRETS[0], {
      expiresIn: AUTH_VALID_FOR_SECONDS,
    });

    // Redirect them back to the home page with a valid bearer in their cookie
    ctx.cookies.set(APP_CONFIG.COOKIE_NAME, authCookie, {
      maxAge: 1000 * AUTH_VALID_FOR_SECONDS,
      httpOnly: false,
    });
    ctx.body = `Redirecting to ${APP_CONFIG.APP_NAME}...`;
    ctx.response.redirect(APP_CONFIG.APP_URL);
    return;
  } catch (err) {
    console.log('Error in auth', err);
    ctx.body = 'Could not auth you: ' + err.message;
    ctx.response.status = 401;
    return;
  }
};
