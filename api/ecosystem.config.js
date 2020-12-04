module.exports = {
  apps: [
    {
      name: 'App Status',
      script: 'server.js',
      node_args: '-r esm',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
