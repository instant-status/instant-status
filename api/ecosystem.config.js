module.exports = {
  apps: [
    {
      name: "Curatr Status v2",
      script: "server.js",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
