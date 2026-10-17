# Phase 03 context: native application adapters

## Scope and evidence boundaries

Active working-theme goal authorises repository-local implementation. Source-based
native adapter work follows the verified Phase 02 package/lifecycle seam; full phase
acceptance still depends on isolated native desktop and target evidence. No activation,
service restart, host config write, VM or background work is introduced here.

| Operation | Owner/source | Check or remaining gap |
|---|---|---|
| Terminal palette/alpha/font configuration | scripts/terminal-theme.mjs; installed Foot/terminal template conventions | Public build output probes plus real Foot/Ghostty config validators |
| Font resolution without installation | Package-local fonts.conf and bundled assets | Scoped Fontconfig lookup and actual metadata; no global font change |
| Borders/blur and opaque window content | Generated hyprland.lua; installed hl.config/hl.window_rule schema | Foreground --verify-config; active session remains untouched |
| Editor syntax/diagnostics/selection | Native Neovim/aether config | Headless native load with real installed aether; no user nvim config |
| System monitor roles | Generated btop.theme | Native rendering/operation still pending isolated desktop |

## Material discoveries

Stock Foot/Alacritty/Ghostty/Kitty user configs load theme colours but then pin their
own fonts. Including a font value in a theme file does not prove actual adoption.
Scoped font checks and fixture previews are valid evidence; applying fonts needs the
separate reversible settings integration. No stock omarchy-font-set is run because
it edits multiple user configs and signals running terminals.

Installed Foot supports --check-config, background alpha/alpha-mode and identical
regular/bold/italic settings to disable synthetic styles. It accepts the generated
file. Bundled font metadata resolves to ShureTechMono Nerd Font Mono / Regular.
Ghostty's explicit +validate-config --config-file also accepts the generated output.
Alacritty/Kitty executables were not found; their formats are generated but not
natively parsed here. Point-size conversion from the design's 16px uses 96dpi
baseline; actual output-scale acceptance remains pending.

Omarchy's default window rules apply opacity 0.985/0.96 to default-opacity tagged
windows. Native theme must override whole-window fading to 1 and use surface alpha
for transparency. Preserve stock state services and client-owned decorations.

## Application/settings follow-up

GTK3/4 parsers accept generated opaque application styles. Qt/Chromium appearance
is not verified. Yazi TOML parses, but disposable terminal trials showed default
colours; startup/navigation/exit is not theme adoption. Fixture settings integration
owns Foot fonts and Fontconfig registration only, with original bytes/modes retained.
Native fc-match resolves the staged font and restoration succeeds.

A public-CLI regression exposed acceptance of a symlinked settings receipt;
rejectSymlinks now guards it. The user-edit test now has an actual original backup
and checks both backup and receipt preservation. No host activation.

## 2026-10-17 finishing scope

The first four authorised finishing areas are implemented and checked live/native.
Current decisions, boundaries and evidence are in docs/live-feature-status.md.
Real SDDM login and final companion lifecycle/full 24-area review remain deferred.
