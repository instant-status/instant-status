const API_CONFIG = {
  APP_NAME: `App Name`,
  APP_SECRETS: ['app-secret'],
  APP_URL: `https://instant-status.example.org`,
  COOKIE_NAME: `Auth-Bearer`,
  AUTH_VALID_FOR_SECONDS: 60 * 60 * 1, // 1 hour
  GOOGLE_AUTH: {
    CLIENT_ID: '123-4a5b6c.apps.googleusercontent.com',
    CLIENT_SECRET: '123abc',
    REDIRECT_URL: 'https://instant-status.example.org/api/auth/google/callback',
  },
  PORT: 3000,
  SLACK_API_KEYS: {
    deployment: 'services/ORG/CHANNEL/KEY', // #deployments-app
    warning: 'services/ORG/CHANNEL/KEY', // #alerts-warning
    critical: 'services/ORG/CHANNEL/KEY', // #alerts-critical
  },
};

export default API_CONFIG;
