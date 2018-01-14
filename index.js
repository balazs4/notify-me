const os = require('os');
const path = require('path');
const request = require('request');
const notifier = require('node-notifier');
const fs = require('fs');

const notify = options =>
  new Promise((resolve, reject) => {
    notifier.notify(options, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });

const download = url =>
  new Promise(resolve => {
    const fallback = 'notification-audio-play';
    if (!url) resolve(fallback);
    const file = path.join(os.tmpdir(), `notify-me.png`);
    request
      .get(url)
      .pipe(fs.createWriteStream(file))
      .on('error', () => {
        resolve(fallback);
      })
      .on('finish', () => {
        resolve(file);
      });
  });

module.exports = ({ publish }) => async ({ payload, topic }) => {
  try {
    const { title, body, iconUrl } = payload;
    const icon = await download(iconUrl);
    await notify({
      title,
      message: body || new Date().toLocaleString(),
      icon
    });
  } catch (err) {
    console.error(err.message);
  }
};
