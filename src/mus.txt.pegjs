{
  var ret = {
    meta: {},
    parts: []
  },
  measureBuffer = []
}

start
  = Meta? Part+ S* {
    return ret
  }

MetaDelim "front-matter delimiter"
  = "---" NL

NL "newline"
  = "\r"? "\n"

S "whitespace"
  = [ \r\n\t]

W "identifier"
  = [^ \r\n\t|:]

Meta "front-matter"
  = MetaDelim MetaLine* MetaDelim NL

MetaLine "meta property"
  = name:W+ ": " value:[^\r\n]+ NL {
    ret.meta[name.join("")] = value.join("")
  }

Part "part"
  = name:PartName? Staff+ {
    ret.parts.push({
      name: name || "part " + (ret.parts.length + 1),
      measures: measureBuffer
    })
  }

PartName "part name"
  = name:W+ ": " {
    return name.join("")
  }

Staff "staff"
  = measures:Measure+ StaffEnd {
    measureBuffer = measureBuffer.concat(measures);
  }

StaffEnd "staff end"
  = ( "||" / "|" ) S+

Measure "measure"
  = "|"+ repeatStart:":"?
  events:Event+ " "
  repeatEnd:":"? &"|" {
    var m = {
      events: events
    }
    if (repeatStart) {
      m.repeatStart = true
    }
    if (repeatEnd) {
      m.repeatEnd = true
    }
    return m
  }

Event "event"
  = " " ev:( Time / Note / Rest / Key / Jump ) &" " {
    return ev
  }

Note "note"
  = syllable:Syllable "/"? properties:Property* tie:"^"? {
    var m = {
      type: "note",
      syllable: syllable
    }
    if (typeof properties !== "undefined") {
      properties.forEach(function (p) {
        if (p.match(/^\d+$/)) {
          m.duration = parseInt(p, 10)
        }
        else if (p === '_') {
          m.fermata = true
        }
        else if (p === '^') {
          m.tie = true
        }
      });
    }
    return m
  }

Rest "rest"
  = "-" "/"? duration:Num {
    var m = {
      type: "rest"
    }
    if (typeof duration !== "undefined") {
      m.duration = duration
    }
    return m
  }

Property "property"
  = ( Num / "_" / "^" )

Num "number"
  = (
    "64"
  / "32"
  / "24"
  / "16"
  / "12"
  / "9"
  / "8"
  / "7"
  / "6"
  / "5"
  / "4"
  / "3"
  / "2"
  / "1"
  )

Key "key signature"
  = "(" syllable:Syllable ")" {
    var m = {
      type: "key",
      key: syllable
    }
    return m
  }

Time "time signature"
  = "(" numerator:Num "/" denominator:Num ")" {
    var m = {
      type: "time",
      time: [ parseInt(numerator, 10), parseInt(denominator, 10) ]
    }
    return m
  }

Jump "jump"
  = ( down:"<"+ / up:">"+ ) {
    var m = {
      type: "jump",
      value: 0
    }
    if (typeof down !== "undefined") m.value -= down.length * 12
    if (typeof up !== "undefined") m.value += up.length * 12

    return m
  }

Syllable "syllable"
  = (
    "de"
  / "do"
  / "di"
  / "ra"
  / "re"
  / "ri"
  / "me"
  / "mi"
  / "fa"
  / "fi"
  / "se"
  / "sol"
  / "si"
  / "le"
  / "la"
  / "li"
  / "te"
  / "ti"
  )