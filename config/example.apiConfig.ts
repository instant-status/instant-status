const API_CONFIG = {
  APP_SECRET: "your-256-bit-secret",
  ALLOWED_USERS: {
    "user@example.com": { roles: [""] },
  },
  GOOGLE_AUTH: {
    CLIENT_ID: "",
    CLIENT_SECRET: "",
    REDIRECT_URL: "http://localhost:3000/auth/google/callback",
  },
};

export default API_CONFIG;
