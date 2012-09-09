var yaml = require('js-yaml')
  , parser = require('./parser')
  , midiapi = require('midi-api')
  , solfege = require('solfege')
  , es = require('event-stream')

exports.parse = function (str) {
  var ret = {
    meta: {}
  };
  var metaSplit = str.split(/\s+\-\-\-\s+/), meta;
  if (metaSplit.length > 1) {
    if (metaSplit[0] === '') {
      metaSplit.shift();
    }
    ret.meta = yaml.load(metaSplit.shift());
    str = metaSplit.join('');
  }
  ret.parts = parser.parse(str);
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
    var midi = midiapi()
      , pitch = 60
      , duration = 4
      , bpm = score.meta.bpm || 120
      , measureTime
      , syllable = 'do'
      , patch = score.meta.patch || 0

    // Initial time
    renderTime({time: score.meta.time ? score.meta.time.split(/\s*\/\s*/).map(function (k) {
      return parseInt(k, 10);
    }) : [4, 4]});

    // Initial key
    renderKey({syllable: score.meta.key || 'do'});

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
      // length of one beat multiplied by number of beats
      measureTime = (60000 / bpm) * ev.time[0];
    }

    function renderNote (ev) {
      // apply pitch adjustment and update current syllable
      pitch += solfege.moveTo(syllable, ev.syllable);
      syllable = ev.syllable;

      // apply duration
      if (ev.duration) {
        duration = ev.duration;
      }

      // Send MIDI events
      midi
        .noteOff()
        .noteOn(pitch)
        .rest(measureTime / duration)

      // render a fermata
      if (ev.fermata) {
        midi
          .rest(measureTime / duration)
          .noteOff()
          .rest(measureTime / duration / 2)
      }
    }

    function renderRest (ev) {
      // apply duration
      if (ev.duration) {
        duration = ev.duration;
      }

      midi.rest(measureTime / duration);
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