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

const statValues = _.mapValues(_.reduce(stats, null));

function parseHars(log) {
  const assets = _.pipe(
    loadTimesByUrl,
    statValues,
    _.toPairs,
    _.orderBy(_.get('[1].mean'), 'desc')
  )(log);

  const pageLoads = _.pipe(
    _.reduce((memo, {pageTimings}) => {
      memo.onContentLoad.push(pageTimings.onContentLoad);
      memo.onLoad.push(pageTimings.onLoad);
      return memo;
    }, { onContentLoad: [], onLoad: [] }),
    statValues
  )(log.pages);

  return {assets, pageLoads};
}

module.exports = function searchHar({pageLoads = 20} = {}, cb) {
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
