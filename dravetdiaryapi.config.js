module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'nodejsapi',
      script: './build.prod.js',
      output: '~/.pm2/logs/nodejsapi.log',
      env: {
        NODE_ENV: 'development'
      },
      env_staging: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
