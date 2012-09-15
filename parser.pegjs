{
  var partCount = 0
}

start
  = meta:Meta? parts:Part+ {
    var ret = {
      parts: parts,
      meta: ""
    }
    if (typeof meta !== "undefined") {
      ret.meta = meta
    }
    return ret
  }

NL "newline"
  = "\r"? "\n"

S "whitespace"
  = [ \r\n\t]

Meta "meta"
  = S* ( "```" / "---" ) NL content:[^`]+ ( "```" / "---" ) S* {
    return content.join("")
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

Part "part"
  = name:Header? meta:Meta? measures:Measure+ S* {
    partCount++
    var ret = {}
    if (typeof name !== "undefined" && name !== "") ret.name = name
    else ret.name = "part " + partCount
    ret.measures = measures
    ret.meta = ""
    if (typeof meta !== "undefined") {
      ret.meta = meta
    }
    return ret
  }

Header "header"
  = "#"+ " " name:[^\r\n]+ NL S* {
    return name.join("")
  }

Measure "measure"
  = [ \t]* ( ( Num+ "." ) / "-" ) events:Event+ NL {
    return events
  }

Event "event"
  = " " ev:( Time / Note / Rest / Key / Jump ) &" "* {
    return ev
  }

Note "note"
  = syllable:Syllable props:Properties? {
    var m = {
      type: "note",
      syllable: syllable
    }
    if (typeof props === "object") {
      Object.keys(props).forEach(function (k) {
        m[k] = props[k]
      })
    }

    return m
  }

Properties "properties"
  = "/"? props:( Duration / Fermata / Dot / Tie )+ {
    var m = {}
    props.forEach(function (prop) {
      m[prop.name] = prop.value
    })
    return m
  }

Duration "duration"
  = duration:Num {
    return { name: "duration", value: duration }
  }

Fermata "fermata"
  = "_" {
    return { name: "fermata", value: true }
  }

Dot "dot"
  = dot:"."+ {
    return { name: "dot", value: dot.length }
  }

Tie "tie"
  = "^" {
    return { name: "tie", value: true }
  }

Num "number"
  = digit:( "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" )+ {
    return parseInt(digit.join(""), 10)
  }

Rest "rest"
  = "-" "/"? duration:Num? {
    var m = {
      type: "rest"
    }
    if (typeof duration !== "undefined") {
      m.duration = parseInt(duration, 10)
    }
    return m
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
    if (~jump.indexOf("<")) m.value -= jump.length * 12
    else m.value += jump.length * 12

    return m
  }
