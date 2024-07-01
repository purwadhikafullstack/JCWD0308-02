module.exports = {
    apps: [
      {
        name: 'jcwd030802-web',
        script: 'npm',
        args: 'run serve',
        env: {
          PORT: 3082,
          NODE_ENV: 'production',
        },
        cwd: '/var/www/html/jcwd030802.purwadhikabootcamp.com/apps/web',
      },
      {
        name: 'jcwd030802-api',
        script: 'npm',
        args: 'run serve',
        env: {
          PORT: 3182,
          NODE_ENV: 'production',
        },
        cwd: '/var/www/html/jcwd030802.purwadhikabootcamp.com/apps/api',
      },
    ],
   };