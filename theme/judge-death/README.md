# Judge Death

Original option A pterodactyl artwork, near-black green surfaces, bone text and pale-green
accent. Inherits Drokk's shared fonts, controls and accepted bar settings.

```sh
mise run theme:build-death
mise exec -- node scripts/theme.mjs check --out dist/judge-death
```

Build requires native `rsvg-convert`. Artwork is preserved; the lock PNG is a
rendering of the selected SVG. Raster art retains its colours on palette edits.

**Status:** active locally with pterodactyl companions and the Death SDDM login selected.
Installed login files match the checked package. Real Death lock/unlock/login and
public installation remain pending.
