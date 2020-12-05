import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '../../appConfig';
import { API_CONFIG } from '../../apiConfig';

let bearerTokens = [API_CONFIG.BEARER_TOKEN];

const CLIENT_ID = API_CONFIG.GOOGLE_AUTH.CLIENT_ID;
const CLIENT_SECRET = API_CONFIG.GOOGLE_AUTH.CLIENT_SECRET;
const REDIRECT_URL = API_CONFIG.GOOGLE_AUTH.REDIRECT_URL;
const AUTH_VALID_FOR_SECONDS = 60 * 60 * 1; // 1 hour

export const isRequestAllowed = (request) => {
  // Don't require auth if user is trying to log in
  if (request.url.includes('/auth/google/callback')) {
    return true;
  }

  // Check if provided token is in allowed bearers
  if (bearerTokens.indexOf(request.token) > -1) {
    return true;
  }

  // Check if provided token is a valid JWT
  try {
    jwt.verify(request.token, API_CONFIG.APP_SECRET);
    return true;
  } catch (err) {
    // if not valid, catch the error and allow the app to return false below
  }

  return false;
};

export const authGoogle = async (ctx) => {
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

    const authCookie = jwt.sign(validUsers, API_CONFIG.APP_SECRET, {
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
