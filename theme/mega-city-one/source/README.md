# Canonical Mega-City One design inputs

Promoted byte-for-byte from the existing design work. provenance.json records
origin, role and SHA-256 for each copied file. Production must read this tracked
source tree, never ignored output/. No files are committed yet.

palette.json owns 125 semantic colours/links and 39 alpha controls. typography.json
owns font roles; effects.json owns the 8px blur design target; areas.json retains
all 24 original requirements, including mockup-only limitations. A renderer must map
native supported keys and report custom or still-unimplemented consumers.

assets/emblem.source.svg is the editable classic eagle. The richer preferred lock
eagle is separate reference artwork; production extraction remains outstanding.
assets/bar-states.json contains illustrative fixture states, never live readings.
assets/bar-icons.json names installed plugin identities; paths do not grant service
functionality or redistribution rights. Do not install unrelated integrations.

fonts/ contains existing Share Tech, Plex Sans and JetBrains binaries and their
OFL notices. Nimbus remains an explicit gsfonts system dependency. See
[asset provenance](../../../docs/asset-provenance.md).
