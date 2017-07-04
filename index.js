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

const download = (
  url = 'http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/radio-icon.png'
) => {
  if (!url) {
    return undefined;
  }
  return new Promise(resolve => {
    const base64 = new Buffer(url).toString('base64');
    const file = path.join(os.tmpdir(), `${base64}.png`);
    if (fs.existsSync(file)) {
      resolve(file);
      return;
    }
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

const marker = path.join(os.tmpdir(), 'notifyme.json');

module.exports = ({ publish }) => async ({ payload, topic }) => {
  try {
    const { title, body, iconUrl } = payload;

    const icon = await download(iconUrl);

    const notification = {
      title,
      message: body || new Date().toLocaleString(),
      icon
    };
    const previous = await new Promise(resolve => {
      fs.readFile(marker, (err, data) => {
        if (err) resolve('');
        else resolve(data.toString());
      });
    });

    if (JSON.stringify(notification) === previous) {
      return;
    }

    await notify(notification);
    await new Promise(resolve => {
      fs.writeFile(marker, JSON.stringify(notification), err => {
        resolve();
      });
    });
  } catch (err) {
    console.error(err.message);
  }
};
