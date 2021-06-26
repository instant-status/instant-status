const APP_CONFIG = {
  APP_NAME: "App Status",
  APP_URL: "http://localhost:1234",
  DATA_URL: "http://localhost:3000",
  GITHUB_VERSION_URL: "https://github.com/instant-status/instant-status/tree/",
  GOOGLE_AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth?...",
  COOKIE_NAME: "Bearer",
  CARD_ADVANCED_MAPPING: {
    server_id: "Server ID",
    server_availability_zone: "Server AZ",
  },
  DEV_MODE: true,
  DEV_JWT:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSW5zdGFudCBTdGF0dXMiLCJpYXQiOjE1MTYyMzkwMjJ9.Th-AFgMpPdgvUm2U3VpXCelnofPMaj1QIUSpco24yuQ",
  PORT: 3000,
  DEFAULTS: {
    KEY_LOCATION: "~/.ssh/",
    SERVER_DISPLAY_COUNT: 2,
    ORDER_BY: "stack_id",
    SHOW_MORE_INFO: false,
  },
};

export default APP_CONFIG;
