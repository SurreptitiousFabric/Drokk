# Brit-Cit context

Scope: Phase 09 supersedes the Mega-City-One-only exclusion for this variant.
Preserved design inputs are under output/dredd-theme-family/variants/brit-cit.
Canonical variant overrides and selected assets are promoted into theme/brit-cit/source.
Shared implementation remains in theme/mega-city-one/source; a temporary merged
source is built and removed synchronously. No second production implementation.

| Operation | Owner | Check or gap |
|---|---|---|
| Palette/build/preview | shared build + variant overrides | generated-package behavioural test |
| Bar identity | selected architectural lion SVG | token propagation test |
| Lock artwork | exact selected PNG | byte equality; native rendering pending |
| Login artwork/form | exact existing illustration + shared QML | byte equality; composition inspection |
| Install/switch/remove | existing Mega-City-specific lifecycle tools | not yet variant-aware; do not use on live Brit-Cit |

The lock PNG and embossed login illustration are fixed-colour raster exceptions;
they do not automatically recolour when the accent changes. Geometry/typography
and effects otherwise inherit the working Mega-City One source. Shared plugin IDs
are retained for now; concurrent installation/activation is not yet accepted.

Review decisions: keep existing plugin IDs as shared implementation identifiers,
not a second installed plugin family. The legacy installer refuses the new package
before writes until variant lifecycle support is implemented. Brit-Cit display
names propagate to its browser manifest and package preview. Rasterise the selected
bar SVG filters with installed librsvg so Qt can display it; this is a derived
rendering, not a redraw. Login uses shared form logic at x666/y303/scale .87 with
the flat lion/flag as the small separator emblem. Current native lock preview
inherits the active desktop shell colours; only its layout/artwork were inspected.

The user subsequently authorised connecting Brit-Cit companions and changing the
login. Registered explicit variant edits in the existing session profile; its
transaction removes previous-variant edits before applying the next. The lock
SVG wrapper embeds the exact original PNG and preserves its aspect ratio; the
PNG remains packaged unchanged. Bar/lock text assets now follow the selected
profile. Shared identifiers remain internal rather than separate plugin copies.
Separate root-owned Brit-Cit SDDM installation and a later-sorting selection
file preserve the existing eagle greeter. Desktop switches do not alter SDDM.
