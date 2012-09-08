var parser = require('./build/score')
  , midiapi = require('midi-api')
  , solfege = require('solfege')
  , es = require('event-stream')

exports.parse = parser.parse.bind(parser);

exports.render = function () {
  var stream = es.through(write, end)
    , buf = ''
    , score
    , channel = 0
    , partsEnded = 0
 
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
    score.parts.forEach(render);
  }

  function render (part) {
    var midi = midiapi()
      , pitch = 60
      , duration = 4
      , bpm = 60
      , measureTime
      , syllable = 'do'

    // link with main stream
    midi.on('data', stream.emit.bind(stream, 'data'));
    midi.once('end', function () {
      if (++partsEnded === score.parts.length) {
        stream.emit('end');
      }
    });

    // Initial time of 4/4
    renderTime({time: [4, 4]});

    midi
      .channel(channel++) // each part gets its own channel
      .bank(0)
      .program(renderPatch())
      .rest(500) // rest to allow the MIDI device to warm up

    function renderMeasure (measure) {
      measure.events.forEach(function (ev) {
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

    function renderPatch () {
      // @todo: enable per-part patch metadata
      return parseInt(score.meta.patch || 0, 10);
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