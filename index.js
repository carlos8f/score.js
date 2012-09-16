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
      , velocity

    // Initial time
    renderTime({time: time});

    // Initial key
    renderKey({syllable: part.key || 'do'});

    // Initial velocity
    renderDynamics({value: 'mf'});

    midi
      .channel(part.channel || channel++) // each part gets its own channel
      .bank(part.bank || 0)
      .program(part.patch || 0)
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
          case 'dynamics': fn = renderDynamics; break;
          case 'chord': fn = renderChord; break;
          case 'sustain': fn = renderSustain; break;
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
        .noteOn(pitch, velocity)
        .rest(noteTime)

      if (ev.fermata) {
        renderFermata();
      }
    }

    function renderRest (ev) {
      // apply duration
      if (ev.duration) {
        duration = ev.duration;
      }

      midi.rest(getTime(duration));

      if (ev.fermata) {
        renderFermata();
      }
    }

    function renderFermata () {
      var noteTime = getTime(duration);
      midi
        .rest(noteTime) // double the time
        .noteOff()
        .rest(noteTime / 2) // with some rest at the end
    }

    function renderKey (ev) {
      pitch += solfege.moveTo(syllable, ev.syllable);
      syllable = 'do';
    }

    function renderJump (ev) {
      pitch += ev.value;
    }

    function renderDynamics (ev) {
      velocity = exports.dynamicsMap[ev.value];
    }

    function renderSustain (ev) {
      midi.control(0x40, ev.value ? 127 : 0);
    }

    function renderChord (ev) {
      var rootPitch, rootSyllable;

      midi.noteOff();

      ev.events.forEach(function (ev) {
        if (ev.type === 'jump') {
          pitch += ev.value;
        }
        else if (ev.type === 'note') {
          pitch += solfege.moveTo(syllable, ev.syllable);
          syllable = ev.syllable;
          if (!rootPitch) {
            rootPitch = pitch;
            rootSyllable = syllable;
          }
          midi.noteOn(pitch, velocity);
        }
      });

      // apply duration
      if (ev.duration) {
        duration = ev.duration;
      }

      var noteTime = getTime(duration);

      midi.rest(noteTime);

      if (ev.fermata) {
        renderFermata();
      }

      pitch = rootPitch;
      syllable = rootSyllable;
    }

    part.measures.forEach(renderMeasure);
    return midi;
  }

  return stream;
};

exports.dynamicsMap = {
  ppp: 24,
  pp: 44,
  p: 54,
  mp: 64,
  mf: 74,
  f: 84,
  ff: 94,
  fff: 114
};