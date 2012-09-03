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
      name: name,
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
  = Note / Key

Note "note"
  = " " syllable:Syllable ( "," properties:W+ )? tie:"^"? &" " {
    var m = {
      type: "note",
      syllable: syllable
    }
    if (typeof properties !== "undefined") {
      m.properties = properties.join("")
    }
    if (tie) {
      m.tie = true
    }
    return m
  }

Key "key signature"
  = " (" key:Syllable ")" &" " {
    var m = {
      type: "key",
      key: key
    }
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