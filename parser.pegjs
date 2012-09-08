{
  var partCount = 0
}

start
  = Part+

NL "newline"
  = "\r"? "\n"

S "whitespace"
  = [ \r\n\t]

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

Part "part"
  = name:Header? measures:Measure+ S* {
    partCount++
    var ret = {}
    if (typeof name !== "undefined" && name !== "") ret.name = name
    else ret.name = "part " + partCount
    ret.measures = measures
    return ret
  }

Header "header"
  = "#"+ " " name:[^\r\n]+ NL S* {
    return name.join("")
  }

Measure "measure"
  = [ \t]* ( ( Num+ "." ) / "-" ) events:Event+ NL {
    return events;
  }

Event "event"
  = " " ev:( Time / Note / Rest / Key / Jump ) &" "* {
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
        else if (p === "_") {
          m.fermata = true
        }
        else if (p === "^") {
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
  = digit:( "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" )+ {
    return digit.join("")
  }

Key "key signature"
  = "(" syllable:Syllable ")" {
    var m = {
      type: "key",
      syllable: syllable
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
  = jump:( "<"+ / ">"+ ) {
    var m = {
      type: "jump",
      value: 0
    }
    if (~jump.indexOf("<")) m.value -= jump.length * 12;
    else m.value += jump.length * 12

    return m
  }
