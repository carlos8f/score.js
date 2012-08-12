{
  var ret = {
    meta: {},
    parts: []
  },
  measureBuffer = [];
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

W "word"
  = [^ \r\n\t|:]

Meta "front-matter"
  = MetaDelim MetaLine* MetaDelim NL

MetaLine "meta property"
  = name:[^:\r\n]+ ": " value:[^\r\n]+ NL {
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
  = name:[^:\r\n]+ ": " {
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
  notes:Note+ " "
  repeatEnd:":"? &"|" {
    return {
      repeatStart: !!repeatStart,
      notes: notes.join(" "),
      repeatEnd: !!repeatEnd
    }
  }

Note "note"
  = " " pitch:Syllable ( "," alterations:W+ )? "^"? &" " {
    return {
      pitch: pitch,
      alterations: typeof alterations !== 'undefined' && alterations.join("")
    }
  }
  / Key

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
  = "(" key:Syllable ")" {
    return {
      key: key
    }
  }