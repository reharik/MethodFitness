module.exports = {
  apps: [
    {
      name: 'Workflows',
      script: './app/index.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      watch: ['app/src', 'node_modules'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
