var fs = require('fs');
fs.existsSync || (fs.existsSync = path.existsSync);
var request = require('request');

module.exports = function (url, program) {
  url = String(url);

  function play (stream) {
    stream
      .pipe(require('../').render())
      .pipe(require('coremidi')())
  }

  if (fs.existsSync(url)) {
    play(fs.createReadStream(url, {encoding: 'utf8'}));
  }
  else if (url.match(/^[0-9a-f]+$/)) {
    request({url: 'https://api.github.com/gists/' + url, json: true}, function (err, res, data) {
      if (res.statusCode !== 200) {
        err = new Error('github returned status code ' + res.statusCode);
      }
      if (err) {
        console.error('error fetching gist: ' + err.message);
        process.exit(1);
      }
      url = data.files[Object.keys(data.files)[0]].raw_url;
      play(request(url));
    });
  }
  else if (url.match(/^http/)) {
    play(request(url));
  }
  else {
    console.error('could not make sense of ' + url);
    process.exit(1);
  }
};