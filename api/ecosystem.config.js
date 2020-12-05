module.exports = {
  apps: [
    {
      name: 'App Status',
      script: 'server.ts',
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
