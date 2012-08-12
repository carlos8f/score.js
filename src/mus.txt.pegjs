{
  var ret = {
    meta: {},
    parts: []
  }
}

start
  = Meta? Part { return ret }

MetaDelim
  = "---\n"

Meta
  = MetaDelim MetaLine* MetaDelim

MetaLine
  = name:[^:\n]+ ": " value:[^\n]+ "\n" { ret.meta[name.join("")] = value.join(""); }

Part
  = chars:.* { return chars.join("") }
