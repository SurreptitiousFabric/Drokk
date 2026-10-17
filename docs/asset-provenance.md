# Artwork ownership, provenance and third-party notices

The project owner confirms the original artwork and supplied wallpapers are
their own. Original code and documentation are [0BSD licensed](../LICENSE). Original artwork
is dedicated under [CC0 1.0](../ARTWORK-LICENSE.md), as authorised by the owner. Third-party
material keeps its existing licences; see [the notice inventory](../THIRD-PARTY-NOTICES.md).

## Original assets

| Asset | Source and treatment |
|---|---|
| Palette, typography, effects, editable eagle/folder/symbols | Canonical source files; generated consumers share tokens |
| Wallpapers | User-supplied originals; additions copied byte-for-byte, with source paths/dimensions/hashes recorded |
| Lock eagle | Exact 156×110 crop from approved reference, with authorised alpha-only background removal; RGB samples preserved |
| Login artwork | Exact approved monumental image; native form covers painted controls within its plaque |
| Cursor family | Generated native assets from the established paths and shared palette |

[Initial promotion provenance](../theme/mega-city-one/source/provenance.json)
records the historical promotion event, not current hashes for every subsequently
edited source. Wallpaper provenance is in
[backgrounds.provenance.json](../theme/mega-city-one/source/assets/backgrounds.provenance.json);
lock extraction has its own
[derivation record](../theme/mega-city-one/source/assets/lock-emblem.provenance.json).
The current build manifest verifies generated payload bytes. Raster artwork and
the exact lock crop do not automatically recolour with palette changes.

## Third-party material

| Material | Notice retained in source |
|---|---|
| Pinned Omarchy menu, lock, notifications and status code | Each source/upstream component retains its MIT LICENSE and SHA256 provenance; generated companions include the notice |
| Share Tech Nerd Font | source/fonts/ShureTechMono-OFL.txt |
| IBM Plex Sans | source/fonts/PlexSans-OFL.txt |
| JetBrains Nerd Font icon role | source/fonts/JetBrains-license/OFL.txt |
| Nimbus Sans Narrow | External gsfonts dependency, not bundled; not covered by the bundled OFL notices |

The [font provenance](../theme/mega-city-one/source/fonts/provenance.json) retains
original download/hash records; those records are not fresh network verification.
Preserve the supplied copyright and licence texts when distributing their files.
The owner's artwork declaration does not replace third-party font/code licences.
Separate release payloads must include the project licence and artwork grant
alongside the retained component notices.
