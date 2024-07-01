module.exports = {
    apps: [
      {
        name: 'jcwd030802-web',
        script: 'npm',
        args: 'run serve',
        env: {
          PORT: webPort,
          NODE_ENV: 'production',
        },
        cwd: '/var/www/html/jcwd030802.purwadhikabootcamp.com/apps/web',
      },
      {
        name: 'jcwd030802-api',
        script: 'npm',
        args: 'run serve',
        env: {
          PORT: apiPort,
          NODE_ENV: 'production',
        },
        cwd: '/var/www/html/jcwd030802.purwadhikabootcamp.com/apps/api',
      },
    ],
   };