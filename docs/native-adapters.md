# Native adapters and evidence

All outputs derive from the shared palette/typography/effects model. Generated
files are not separate editable sources. The [live status](live-feature-status.md)
and [compatibility matrix](compatibility.md) distinguish local appearance from
portable installation.

| Surface | Adapter and observed checks | Limit |
|---|---|---|
| Foot | Native config, ANSI palette, regular Share Tech, parser/font and visible checks | User config can override includes; existing windows may need reopening |
| Ghostty | Generated config and earlier native parser check | No visible acceptance recorded |
| Kitty/Alacritty | Generated native formats | Native parser/desktop acceptance not recorded |
| Hyprland | Lua borders/opacity/blur and scoped layer rules; local parser/live checks | Version-specific Lua API and user overrides; Git-installed override filtering |
| Neovim | Existing Aether v3 integration, semantic highlights, headless and visible checks | Other editor/plugin configurations unverified |
| btop/Yazi | Native theme formats and visible local captures | Yazi requires explicit native config adoption; every app behaviour not tested |
| GTK3/4/Files | CSS parsing, native controls, fresh Files navy styling | Running Files can retain old CSS; styles require explicit user imports |
| Qt Widgets | Native GTK3 bridge palette/font and visible controls | Native Fusion geometry remains; arbitrary chrome not replaced |
| Browser | Generated Chromium theme extension | Browser adoption and complete chrome matching not accepted |
| Icons/cursor | Optional folder overlay and Xcursor family; lookup/48 state-size checks | Registration separate; ordinary package uses stock icons; all DPI/app paths unverified |

Terminal background alpha starts at .92; capture fixtures sometimes force opaque
backgrounds solely to avoid unrelated content. That does not change live opacity.
Share Tech has a regular face; style slots use that face rather than fabricated
bold/italic variants. Foot's 16px and other terminals' nominal 12pt assume 96dpi;
scaling parity across other outputs is not established.

GTK CSS and Qt palette adoption were checked locally. The bridge's measured
Window #0e1721 differs by at most one RGB step from source #0e1822; gold selection
and cream text match. No QSS injection was needed for that check.

`theme:check-native` checks parsers, font resolution, Aether highlights, GTK CSS,
Yazi TOML and an isolated font configuration/restoration fixture. It is not a
compositor screenshot, real authentication or final companion lifecycle check.
Missing dependencies fail explicitly. The generated coverage report is a coarse
adapter inventory and may retain conservative pending labels; it is not the
current acceptance ledger. Use the live status and build log for observed results.

The later Dune comparison added a native gold border sweep and a 28px bar. Original
Share Tech Mono now supplies shell text while JetBrains Nerd Font supplies icon
glyphs at native size; terminals keep patched Share Tech. Both font licences are
bundled. Theme-scoped adoption and restoration are in [theme switching](theme-switching.md).
