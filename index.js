var yaml = require('js-yaml')
  , parser = require('./parser')
  , midiapi = require('midi-api')
  , solfege = require('solfege')
  , es = require('event-stream')

exports.parse = function (str) {
  var ret = parser.parse(str + "\n");

  function parseMeta (obj) {
    var meta = yaml.load(obj.meta || '') || {};
    Object.keys(meta).forEach(function (k) {
      obj[k] = meta[k];
    });
    delete obj.meta;
  }

  parseMeta(ret);
  ret.parts.forEach(parseMeta);

  return ret;
};

exports.render = function () {
  var stream = es.through(write, end)
    , buf = ''
    , score
    , channel = 0
 
  function write (data) {
    buf += data;
  }

  function end () {
    try {
      score = exports.parse(buf);
    }
    catch (e) {
      stream.emit('error', e);
      stream.emit('end');
      stream.destroy();
      return;
    }
    var merged = es.merge.apply(null, score.parts.map(render));
    merged.on('data', stream.emit.bind(stream, 'data'));
    merged.once('end', stream.emit.bind(stream, 'end'));
  }

  function render (part) {
    Object.keys(score).forEach(function (k) {
      if (k !== 'parts' && typeof part[k] === 'undefined') {
        part[k] = score[k];
      }
    });
    var midi = midiapi()
      , pitch = 60
      , duration = 4
      , time = part.time ? part.time.split(/\s*\/\s*/).map(function (k) {
          return parseInt(k, 10);
        }) : [4, 4]
      , bpm = part.bpm || 120
      , beatTime
      , syllable = 'do'
      , patch = part.patch || 0

    // Initial time
    renderTime({time: time});

    // Initial key
    renderKey({syllable: part.key || 'do'});

    midi
      .channel(channel++) // each part gets its own channel
      .bank(0)
      .program(patch)
      .rest(500) // rest to allow the MIDI device to warm up

    function renderMeasure (measure) {
      measure.forEach(function (ev) {
        var fn;
        switch (ev.type) {
          case 'time': fn = renderTime; break;
          case 'note': fn = renderNote; break;
          case 'rest': fn = renderRest; break;
          case 'key': fn = renderKey; break;
          case 'jump': fn = renderJump; break;
        }
        fn(ev); 
      });
    }

    function renderTime (ev) {
      // find the length of one beat in ms.
      beatTime = 60000 / bpm;
    }

    function getTime (duration) {
      // given a duration number, get the time (ms) relative to the time signature.
      if (duration === 1) {
        return beatTime * time[0];
      }
      return (time[1] / duration) * beatTime;
    }

    function renderNote (ev) {
      // apply pitch adjustment and update current syllable
      pitch += solfege.moveTo(syllable, ev.syllable);
      syllable = ev.syllable;

      // apply duration
      if (ev.duration) {
        duration = ev.duration;
      }

      var noteTime = getTime(duration);

      // Send MIDI events
      midi
        .noteOff()
        .noteOn(pitch)
        .rest(noteTime)

      // render a fermata
      if (ev.fermata) {
        midi
          .rest(noteTime) // double the time
          .noteOff()
          .rest(noteTime / 2) // with some rest at the end
      }
    }

    function renderRest (ev) {
      // apply duration
      if (ev.duration) {
        duration = ev.duration;
      }

      midi.rest(getTime(duration));
    }

    function renderKey (ev) {
      pitch += solfege.moveTo(syllable, ev.syllable);
      syllable = 'do';
    }

    function renderJump (ev) {
      pitch += ev.value;
    }

    part.measures.forEach(renderMeasure);
    return midi;
  }

  return stream;
};