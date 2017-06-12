module.exports = {
  apps: [
    {
      name: 'jukebox-notify-me',
      cwd: '/home/balazs4/Src/notify-me/',
      script: 'npm',
      args: ['run', 'start:jukebox'],
      env: { BROKER: 'mqtt://piserver:1883' }
    }
  ]
};
