const harCapturer = require('chrome-har-capturer');

// TODO: make dateTime dynamic
// TODO: add variable number of requests
module.exports = function searchHar(cb) {
  let done = false;

  const capturerInstance =
    harCapturer.load([
      'https://www.opentable.com/s/?covers=2&dateTime=2017-04-28%2019%3A00&metroId=4&regionIds=5&enableSimpleCuisines=true&pageType=0',
      'https://www.opentable.com/s/?covers=2&dateTime=2017-04-28%2019%3A00&metroId=4&regionIds=5&enableSimpleCuisines=true&pageType=0'
    ]);

  capturerInstance.on('end', hars => {
    const res = hars;

    if (!done) {
      done = true;
      cb(null, res);
    }
  });

  capturerInstance.on('error', err => {
    if (!done) {
      done = true;
      cb(err);
    }
  });
};
