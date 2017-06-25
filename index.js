const os = require('os');
const path = require('path');
const fs = require('fs');
const request = require('request');
const notifier = require('node-notifier');

const notify = options =>
  new Promise((resolve, reject) => {
    notifier.notify(options, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });

const download = (
  url = 'http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/radio-icon.png'
) => {
  if (!url) {
    return undefined;
  }
  return new Promise(resolve => {
    const file = path.join(os.tmpdir(), `notify-me-${Date.now() % 1000}.png`);
    request
      .get(url)
      .pipe(fs.createWriteStream(file))
      .on('error', () => {
        resolve(undefined);
      })
      .on('finish', () => {
        resolve(file);
      });
  });
};

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
