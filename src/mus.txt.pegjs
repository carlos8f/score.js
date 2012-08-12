{
  var ret = {
    meta: {},
    parts: []
  },
  measureBuffer = [],
  keyChange = "do"
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
  Key?
  notes:Note+ " "
  repeatEnd:":"? &"|" {
    var m = {
      notes: notes
    }
    if (keyChange) {
      m.key = keyChange
      keyChange = null
    }
    if (repeatStart) {
      m.repeatStart = true
    }
    if (repeatEnd) {
      m.repeatEnd = true
    }
    return m
  }

Note "note"
  = " " pitch:Syllable ( "," alterations:W+ )? tie:"^"? &" " {
    var m = {
      pitch: pitch
    }
    if (typeof alterations !== "undefined") {
      m.alterations = alterations.join("")
    }
    if (tie) {
      m.tie = true
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
  / "so"
  / "si"
  / "le"
  / "la"
  / "li"
  / "te"
  / "ti"
  )

Key "key signature"
  = " (" key:Syllable ")" &" " {
    keyChange = key
  }