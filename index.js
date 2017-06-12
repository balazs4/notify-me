const notifier = require('node-notifier');

const notify = options =>
  new Promise((resolve, reject) => {
    notifier.notify(options, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });

module.exports = ({ publish }) => async ({ payload, topic }) => {
  try {
    const { title, body, iconUrl } = payload;
    await notify({
      title,
      message: body || new Date().toLocaleString()
    });
  } catch (err) {
    console.error(err.message);
  }
};
