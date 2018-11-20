module.exports = {
  apps: [
    {
      name: 'API',
      script: './app/index.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      watch: ['app/src', 'node_modules'],
      ignore_watch: ['app/src/swagger'],
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
