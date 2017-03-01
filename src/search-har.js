const harCapturer = require('chrome-har-capturer');
const stats = require('statistics');
const _ = require('lodash/fp');

function loadTimesByUrl(log) {
  const contentLoadedTimestamps = log.pages.map(p =>
    p.pageTimings.onContentLoad + Date.parse(p.startedDateTime)
  );

  return log.entries.reduce((memo, entry, i) => {
    const contentLoadedTimestamp = contentLoadedTimestamps[entry.pageref];
    const entryLoadedTimestamp = Date.parse(entry.startedDateTime) + entry.time;

    if (entry._initiator.type === 'parser' && entryLoadedTimestamp < contentLoadedTimestamp) {
      const url = entry.request.url;
      memo[url] = memo[url] || [];
      memo[url].push(entry.time);
    }

    return memo;
  }, {});
}

function parseHars(log) {
  return _.pipe(
    loadTimesByUrl,
    _.mapValues(_.reduce(stats, null)),
    _.toPairs,
    _.orderBy(_.get('[1].mean'), 'desc')
  )(log);
}

module.exports = function searchHar({pageLoads = 5} = {}, cb) {
  let done = false;

  const url = 'https://www.opentable.com/s/?covers=2&dateTime=2017-04-28%2019%3A00&metroId=4';
  const urls = _.times(_.constant(url), pageLoads);

  const capturerInstance = harCapturer.load(urls);

  capturerInstance.on('end', hars => {
    const res = parseHars(hars.log);

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
