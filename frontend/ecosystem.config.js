module.exports = {
  apps: [
    {
      name: 'FrontEnd',
      script: './app/scripts/start.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
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
