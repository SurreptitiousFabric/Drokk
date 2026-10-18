# Brit-Cit

Inherits Drokk's shared implementation, fonts and effects. Uses slate navy
`#101922`, muted gold `#C6AD78` and steel blue `#718B9D`.

```sh
mise run theme:build-brit-cit
mise exec -- node scripts/theme.mjs check --out dist/brit-cit
```

Build requires the existing native `rsvg-convert` tool (librsvg) to flatten the
selected bar artwork's filters for Qt. No artwork is redrawn.

Output: `dist/brit-cit`. Colours: `source/variant.json`. Exact selected lock and
login artwork: `source/assets`. Raster artwork retains its original colours;
other palette consumers and the bar emblem update on rebuild.

**Status:** installed locally with lion companions; Drokk → Dune → Brit-Cit
switching passed. Brit-Cit SDDM is installed and selected. Real Brit-Cit
lock/unlock/login is unverified. Public installation remains unfinished; the
Mega-City One installer refuses this package. Wallpaper redesign remains separate.
