const searchHar = require('../src/search-har');
const util = require('util');

searchHar({}, (err, res) => {
  if (err) {
    throw new Error('Cannot connect to Chrome: ' + err);
  } else {
    console.log('Done', util.inspect(res, { depth: null, colors: true }));
  }
});
