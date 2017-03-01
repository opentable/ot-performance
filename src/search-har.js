const harCapturer = require('chrome-har-capturer');
const util = require('util');

module.exports = function searchHar() {
  // TODO: make dateTime dynamic
  // TODO: add variable number of requests
  const capturerInstance =
    harCapturer.load([
      'https://www.opentable.com/s/?covers=2&dateTime=2017-02-28%2019%3A00&metroId=4&regionIds=5&enableSimpleCuisines=true&pageType=0',
      'https://www.opentable.com/s/?covers=2&dateTime=2017-02-28%2019%3A00&metroId=4&regionIds=5&enableSimpleCuisines=true&pageType=0'
    ]);

  capturerInstance.on('connect', () => {
    console.log('Connected to Chrome');
  });

  capturerInstance.on('end', har => {
    console.log('hars downloaded', util.inspect(har, { depth: null, colors: true }));
  });

  capturerInstance.on('error', err => {
    console.error('Cannot connect to Chrome: ' + err);
  });
};
