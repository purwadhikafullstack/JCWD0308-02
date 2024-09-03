module.exports = {
    apps: [
      {
        name: 'grosirun-web',
        script: 'npm',
        args: 'run serve',
        env: {
          PORT: 3085,
          NODE_ENV: 'production',
        },
        cwd: '/var/www/html/grosirun.purwadhikabootcamp.com/apps/web',
      },
      {
        name: 'grosirun-api',
        script: 'npm',
        args: 'run serve',
        env: {
          PORT: 3185,
          NODE_ENV: 'production',
        },
        cwd: '/var/www/html/grosirun.purwadhikabootcamp.com/apps/api',
      },
    ],
   };