const APP_CONFIG = {
  APP_NAME: `App Name`,
  DATA_URL: `https://instant-status.example.org/api`,
  GITHUB_VERSION_URL: `https://github.com/app-org/app/tree/`,
  GOOGLE_AUTH_URL: `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=123-4a5b6c.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Finstant-status.example.org%2Fapi%2Fauth%2Fgoogle%2Fcallback`,
  COOKIE_NAME: `Auth-Bearer`,
  CARD_ADVANCED_MAPPING: {
    server_id: `Server ID`,
    server_availability_zone: `Server AZ`,
  },
  DEV_MODE: false,
  DEV_JWT: `eyJ`,
  MONITOR: {
    CHECK_INTERVAL_MINUTES: 1,
    CHECK_INTERVAL_STARTUP_GRACE_MINUTES: 1,
    ALERT_COOLDOWN_MINUTES: 15,
    UNHEALTHY_THRESHOLD: 2,
  },
  DEFAULTS: {
    KEY_LOCATION: `~/.ssh/`,
    SERVER_DISPLAY_COUNT: 3,
    ORDER_BY: `name`,
    SHOW_MORE_INFO: false,
  },
};

export default APP_CONFIG;
