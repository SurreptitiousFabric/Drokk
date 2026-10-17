# Mega-City One implementation and acceptance contract

## Authority and baseline

The user selected Mega-City One as the first working theme. [Goals](../GOALS.md)
and [phases](../PLANS.md) govern scope. This contract preserves the complete
[original requirements](../theme/mega-city-one/source/areas.json) and adds runtime
acceptance. This remains the design/acceptance contract, not the current status
ledger. Partial native/live checks are recorded in [live status](live-feature-status.md);
the current [24-area reconciliation](acceptance.md) records coverage and gaps.

Observed 2026-10-17: aarch64; Omarchy dev 4.0.0.r6589.gdec29fa-1;
Hyprland 0.56.1-3; Quickshell 0.3.0.r20.g28771c7-1; SDDM 0.21.0-7;
Qt6 6.11.2-3; GTK3 3.24.52-1; GTK4 4.22.4-1; libadwaita 1.9.3-1;
Foot 1.27.0-1. This is a version-scoped initial target, not forward compatibility.
Recheck versions and component hashes before runtime acceptance.

## Ownership and implementation layers

The tracked design model owns colours/aliases/alpha, typography, effects and assets.
A renderer maps native supported keys and reports custom/unimplemented consumers.
Portable theme files must not quietly imply that custom layouts are delivered.
A separate user-owned extension layer handles custom shell geometry, window cards,
fonts and application adapters. SDDM is separately packaged. No packaged code edits.

Installed templates expose shell, terminal, btop, Neovim, Chromium and Hyprland
integration. Shell tokens include alpha and shared controls, while exact geometry
and semantic notification tiles require QML. The stock GNOME adapter selects
Adwaita/Adwaita-dark and an icon theme; it does not deliver the full GTK palette.
The browser adapter can write managed policy directories: do not blindly reuse it
or replace unrelated system policy. Stock theme-set starts parallel/background
operations; invocation needs an execution strategy respecting local instructions.

## Operation evidence

Each required operation needs source fingerprint, versions, environment, fixture or
application, action/state, expectation, actual result and screenshot/assertion path.
The phase review owns the acceptance mapping; the build log links it. Run isolated
acceptance before target-machine checks. No passing count or rendered mockup proves
native behaviour. Unavailable evidence stays pending. Third-party bar plugins retain
their identities; absent integrations show unavailable state, never invented readings
or permission to install unrelated services.

## Asset and geometry decisions

Keep the editable classic eagle for bar/icon work and a faithful richer flat eagle
for lock presentation. They are different source representations: never silently
replace the preferred lock eagle with the simpler vector. Lock needs clean rainy
artwork plus live clock/date/user/input/button; login needs monumental artwork
without baked-in controls plus native SDDM controls. The original PNGs are reference
only. Separation of those production assets remains Phase 05/06 work and is not
completed by copying references. Raster paint is an explicit colour-propagation
exception until masks/colour-independent layers exist.

The 38px title region and minus/close controls are concepts, not global Hyprland
server decorations. Preserve client-owned headers; investigate supported app
styling and a scoped owner-tracking overlay for comic cards. Unsupported uniformity
needs an explicit decision, never an invented success. The cursor requires a real
complete Xcursor package; three drawn cursor states are not sufficient.

## Recovery scope

Before installation preserve current theme/background links, shell settings/plugin
selection, Hyprland appearance includes, terminal config, fonts/icons/cursors,
relevant GTK/Qt/browser settings and SDDM theme selection. Current local path/type/hash
inventory is evidence, not a restorable backup. Capture fresh values immediately
before changes, save backups plus ownership/digest receipts, and refuse to overwrite
later user edits. Prove reapply, failed-install rollback and removal in fixtures and
an isolated session before host activation. See [test environment](test-environment.md).

## Detailed areas

### 01 — Wallpaper

- Delivery: Native background; phase 03.
- Owner: background service + backgrounds/.
- Original requirements:
  - Image file, crop anchor centre, aspect fill at 1920×1080. Photorealistic artwork.
  - Artwork pixels are not palette colours; replacing the asset updates desktop backgrounds.
- Original acceptance:
  - No UI embedded in the wallpaper; same crop in every desktop preview.
- Runtime operations: Apply/cycle/restart; aspect-fill crop on supported scales/outputs; no UI pixels.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 02 — Colour palette

- Delivery: Shared generator + native adapters; phase 02.
- Owner: palette.json -> colors.toml, shell.toml and custom consumers.
- Original requirements:
  - Every named colour listed with exact value and inheritance; every alpha from 0 to 1.
  - Palette board includes state specimens, all normal/bright terminal colours and calculated contrast.
- Original acceptance:
  - No literal paint colours outside palette.json in generated vector UI.
  - Changing an inherited colour updates all dependent vector previews and exports.
- Runtime operations: Every alias/alpha valid; cycle/unknown rejection; contrast; one-token propagation in package and previews; unsupported controls explicit.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 03 — Window borders

- Delivery: Native compositor; phase 03.
- Owner: hyprland.lua general/group borders.
- Original requirements:
  - 2 px rectangular border; active gold and inactive blue-grey. No gradient by default.
  - Same frame primitive in all examples.
- Original acceptance:
  - Active/inactive states side by side; changing a border token preserves geometry.
- Runtime operations: Active/inactive focus, grouped windows and 2px logical border. Later user direction adds a native gold/pale-gold/bronze single gradient sweep, matching Dune timing.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 04 — Window appearance

- Delivery: Application decorations + custom overlay; phase 03/04.
- Owner: App-owned headers; user-owned owner-tracking comic-card overlay.
- Original requirements:
  - Rectangular frame, 38 px title region, right-side minus/close controls.
  - Comic card 204×120 px; red body inside owner, right inset 3 px; gold tab protrudes 12 px.
  - No credits in per-window cards.
- Original acceptance:
  - Active/inactive frame and card open/tucked states use identical shared geometry.
- Runtime operations: Open/tucked cards with exact geometry, owner move/resize/close/focus, input passthrough; no fake global titlebar.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 05 — Terminal

- Delivery: Terminal adapters; phase 03.
- Owner: Foot/Alacritty/Ghostty/Kitty supported subset.
- Original requirements:
  - ShureTechMono Nerd Font Mono. 16 px in illustration; installed font size remains separate.
  - ANSI 0–15 mapped to named normal and bright colours; selection is an explicit pair.
- Original acceptance:
  - Show ordinary output, prompt, selection, cursor, error and success.
- Runtime operations: ANSI normal/bright, selection, cursor, error/success, long output and .92 background with opaque text.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 06 — Terminal font

- Delivery: Font asset/config; phase 03.
- Owner: Share Tech actual regular font + terminal settings.
- Original requirements:
  - ShureTechMono Nerd Font Mono Regular, selected from the Share Tech comparison. No synthesized bold or italic.
  - 16 px terminal specimen. Show alphabet, digits, punctuation and ambiguous glyphs using the actual bundled font.
  - Typeface reads from typography.json; icon glyphs retain JetBrainsMono Nerd Font separately.
- Original acceptance:
  - Render actual installed font; do not use invented font identities.
- Runtime operations: fc-match actual file; ambiguous/code/Nerd glyphs, size/DPI/fallback; no synthetic bold/italic.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 07 — Application launcher

- Delivery: Native colours + user menu view; phase 04.
- Owner: shell [menu]/[launcher], Menu.qml/MenuModel.js.
- Original requirements:
  - Compact 360×344 px card centred at (960,540) on 1920×1080 canvas. Radius 10 px, muted blue-grey outline 1 px.
  - No title bar, window buttons or boxed search input. Magnifying glass and caret form the integrated search header.
  - Five rows on a 51 px step; selected row 340×44 px, radius 5 px, 3 px red left border; gold fill with dark selected text.
  - Distinct terminal, folder, globe, editor and gear icons on the canonical 24-unit grid. Idle icons cream; terminal glyph gold on a dark tile.
  - Actual installed app entry point is omarchy-menu toggle apps, using [menu] colours. Theme supports colours, alpha, side-specific selected borders and shared font/spacing.
  - Corner radius follows Hyprland rounding globally. Exact header glyph/caret, different card/row radii and launcher-only geometry require a user-owned QML customization.
  - Background gradient in illustration is subtle. Exact shaded background requires custom QML; stock theme surface colour is flat.
- Original acceptance:
  - Verify installed Menu.qml, Border.qml and Style.qml premises; do not claim a live themed launcher from a mockup.
  - Use identical shared assets and resolved palette values; selecting gold accent updates the selected row.
  - Full preview shows launcher over the fixed wallpaper and bar, without unrelated windows obscuring the composition.
  - Remaining acceptance: keyboard search, navigation, empty results and actual running UI after implementation.
- Runtime operations: 360x344 card, integrated search, independent radii, selected gold/red-left edge; search/arrows/empty/long/many results, launch and Escape.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 08 — Omarchy Shell bar

- Delivery: Native bar + plugin presentation; phase 04.
- Owner: shell [bar], widget layout, actual integration services.
- Original requirements:
  - 26 px design baseline; four visible workspaces; active workspace 2.
  - Left menu/workspaces; centre indicators/clock/keyboard/weather/update; right modules follow shell.json.
  - Height and visible workspaces are design assumptions, not live measurements.
  - Enabled/on modules use accent; idle/action controls use shell.bar.text; unavailable modules use muted; attention uses red. Shared sample states live in assets/bar-states.json. Power is an idle action, not an enabled-state indicator.
  - Native plugin identities in assets/bar-icons.json: Two Bar, iCloud, Sonarchy, Omapods AirPods Pro variant, Proton VPN, Frame TV, Agents glyph. No generic music-note/headphones/shield/brackets replacements for those plugins.
  - Master menu emblem uses the selected Classic source with broad three-feather wings, clear profile head and central shield; no independent redraws.
- Original acceptance:
  - Same emblem, icon paths, order and bar dimensions in all desktop views.
- Runtime operations: 28px bar/order/eagle with native Dune-sized icon glyphs; real enabled/idle/unavailable/attention state transitions and absent plugin handling.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 09 — Notifications

- Delivery: Native colours + custom notification card; phase 04.
- Owner: NotificationCard.qml view; stock notification service retained.
- Original requirements:
  - Right-aligned stack, 42 px right inset and 38 px below the 26 px bar, 380 px card width, 10 px corner radius, 12 px vertical gaps.
  - Download gold tile, connected green tile, low battery red tile, information cyan tile; 46×46 px tile with dark 27 px glyph.
  - Bold 16 px titles, cream 15 px body, gold dismiss X, underlined 14 px Open folder action on download. Small error title uses the contrast-corrected status.error.
  - Card heights 96 or 116 px according to content. Body, tile and text positions share one notificationCard component with compact palette samples.
  - Theme slots control background, text, border and alpha; semantic roles control the tile fills and error heading.
  - Installed NotificationCard.qml supports app/image/glyph icon, bold summary, body text, rounding and card-click/right-click dismiss. Permanent X, independent action links and status-specific tiles/heading treatment require supplied icon artwork and/or a user-owned QML customization.
- Original acceptance:
  - Preserve the original visual hierarchy without comic wallpaper or unrelated frame changes.
  - All text remains readable; error title uses status.error, not decorative red.
  - Colours and shared notification geometry update the screenshot and palette specimens together.
  - Remaining live acceptance: action invocation, dismissal, timeout/hover behaviour, long text wrapping and critical urgency.
- Runtime operations: 380px stack, semantic tiles, permanent dismiss/actions, long text, urgency, hover/timeout/stack/dismiss/action invocation.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 10 — Lock screen

- Delivery: User-owned lock view; stock security; phase 05.
- Owner: LockView.qml with Service.qml lock/PAM/session ownership retained.
- Original requirements:
  - Preserve preferred open rainy-city layout: gold 20:47 clock, date, detailed eagle, anElectricMonk.
  - Password field below user; light outline and gold underline; gold Unlock button.
  - Idle, typing, authentication failure and caps-lock states need layered UI.
- Original acceptance:
  - Preferred reference is preserved. Independent recolouring is blocked until background, emblem and controls are separated.
- Runtime operations: Live time/date/user/input/button; faithful flat eagle; correct/wrong credentials, long input, layout/Caps Lock/focus/loading/retry, all outputs/resume/recovery.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 11 — GTK applications

- Delivery: Scoped GTK adapter; phase 03.
- Owner: User GTK3/GTK4 styles/icons; explicit libadwaita support boundary.
- Original requirements:
  - Preserve native application layout; show buttons, entry, sidebar, checked/unchecked, hover and disabled.
  - Theme coverage depends on GTK version and application styling.
- Original acceptance:
  - Map and verify actual application support before claiming installation parity.
- Runtime operations: Real supported app buttons/entry/sidebar/checked/hover/focus/disabled/invalid; no all-app parity claim.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 12 — Qt applications

- Delivery: Scoped Qt adapter; phase 03.
- Owner: Installed Qt palette/style mechanism; shell QML separate.
- Original requirements:
  - Same role hierarchy as GTK, native Qt widget geometry.
  - Show entry, selected row, normal/default/disabled buttons and tabs.
- Original acceptance:
  - Treat Qt palette and app stylesheet integration as separate implementation checks.
- Runtime operations: Real widget app entry/selected row/tabs/normal-default-disabled buttons/focus; different Qt versions explicit.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 13 — Icons

- Delivery: Canonical emblem/folder/symbol family; phase 03/04.
- Owner: Shared assets + user-owned icon overlay.
- Original requirements:
  - Single folder geometry; single symbolic path family, 1.7 unit strokes on 24×24 grid.
  - Master eagle is the selected A — Classic direction, rebuilt as a single editable vector. Detailed reference eagles remain distinct raster artwork.
- Original acceptance:
  - Editing canonical source SVG templates regenerates matching assets and screenshots.
- Runtime operations: Same geometry at small/large size; folder mappings/symbolic variants; changing source updates all consumers.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 14 — Mouse cursor

- Delivery: Complete native Xcursor family; phase 03.
- Owner: Generated cursor frames/index/hotspots/aliases.
- Original requirements:
  - Pointer, text, busy, link, move, horizontal/vertical/diagonal resize, forbidden and precision states.
  - 16/24/32/48 px targets with explicit hotspots; current screenshot shows only three states.
- Original acceptance:
  - Complete asset family and hotspots must exist before calling this an installable cursor theme.
- Runtime operations: Pointer/text/busy/link/move/H-V-diagonal resize/forbidden/precision, 16/24/32/48px; scale/hotspot/animation/Wayland-Xwayland/fallback.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 15 — Neovim

- Delivery: Neovim adapter; phase 03.
- Owner: Native neovim.lua/aether convention; shared syntax roles.
- Original requirements:
  - Actual Share Tech Mono; shared syntax roles.
  - Show strings, comments, keywords, numbers, search match, selection, diagnostic and diff.
- Original acceptance:
  - Editor values must display the current palette; no embedded stale hex values.
- Runtime operations: Real font; string/comment/keyword/number/search/selection/diagnostic/diff; no stale independent hex values.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 16 — File managers

- Delivery: GTK + terminal app adapters; phase 03.
- Owner: Files icon/sidebar/selection and Yazi theme.toml.
- Original requirements:
  - Graphical Files grid and terminal Yazi list; folders blue-grey, selection gold.
  - Eight folder labels fixed across desktop examples; selected Documents state.
- Original acceptance:
  - Same folder source in every graphical view; Yazi uses terminal palette.
- Runtime operations: Files grid/list/selection/long names, Yazi current/selected/marked/error panes; same folder geometry and shared state colours.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 17 — System monitor

- Delivery: Native btop adapter; phase 03.
- Owner: btop.theme graph/status roles.
- Original requirements:
  - CPU/memory/network sample data clearly illustrative.
  - History blue-grey; current gold; threshold red; same terminal font.
- Original acceptance:
  - Readable legend and labels; no colour-only threshold indication.
- Runtime operations: Actual dynamic CPU/memory/network history; readable labels and non-colour-only thresholds.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 18 — Browser

- Delivery: Browser chrome adapter; phase 03.
- Owner: chromium.theme + supported user theme mechanism.
- Original requirements:
  - Show active/inactive tabs, toolbar, address focus and page boundary.
  - Theme affects chrome; arbitrary website content retains its own styling.
- Original acceptance:
  - No invented dock; distinguish browser chrome from page content.
- Runtime operations: Active/inactive tabs/address focus/toolbar/profile cases/restore; do not overwrite system policies or arbitrary websites.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 19 — Fonts

- Delivery: Font configuration; phase 03/06.
- Owner: User fonts and shell/greeter font lookup.
- Original requirements:
  - Selected Share Tech pairing: ShureTechMono Nerd Font Mono for code/terminal and display headings; IBM Plex Sans for interface labels and notifications.
  - Nimbus Sans Narrow retains comic-card lettering. JetBrainsMono Nerd Font is reserved for the established icon glyphs.
  - Share Tech has only a real regular face in this bundle; never synthesize heavier weights.
  - Bundled fonts feed SVG @font-face, the HTML studio, and a build-scoped Fontconfig configuration for PNG rendering.
- Original acceptance:
  - Show real glyph specimens and normal/secondary/disabled text.
- Runtime operations: Actual Share Tech/Plex/JetBrains/Nimbus families and real faces; normal-secondary-disabled, scaling and greeter account access.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 20 — Background effects

- Delivery: Alpha + compositor + QML clipping; phase 03/04.
- Owner: Terminal background alpha, shell alpha, narrow blur rules.
- Original requirements:
  - Terminal background opacity 0.92; menus and notifications 0.94. Files and other application surfaces stay opaque.
  - Wallpaper-only backdrop Gaussian blur 8 px, clipped to each translucent surface; source in effects.json.
  - Text, icons, title bars, selection fills and borders remain opaque. No whole-window fading.
  - Renderer reconstructs wallpaper backdrop; actual compositor blur and custom shell integration remain to be installed.
- Original acceptance:
  - Surface alpha edits propagate to dependent vector previews without fading text.
  - Shared wallpaper remains sharp outside surfaces; lock/login raster references remain unchanged.
- Runtime operations: Terminal .92, menu/notifications .94, Files opaque, target 8px blur; opaque glyphs/borders, sharp outside, GPU/scaling and native radius differences.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 21 — Workspace indicators

- Delivery: Workspace widget; phase 04.
- Owner: bar/widgets/Workspaces.qml configuration/clone.
- Original requirements:
  - Four workspaces, active 2; 34 px step, 26×20 px active box in 26 px bar.
  - Urgent dot separate from selection; no app shortcut insertion.
- Original acceptance:
  - Preview idle/active/urgent and preserve exact bar asset elsewhere.
- Runtime operations: Four visible when available; real switching/active/urgent, labels/overflow/scaling; no app shortcuts replacing workspaces.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 22 — Screen transitions

- Delivery: Compositor/custom motion; phase 04.
- Owner: Hyprland animation + comic-card state transition.
- Original requirements:
  - Small card open/tucked storyboard. Body clipped within owner during motion.
  - Proposed duration 160 ms; cubic-bezier(.2,0,0,1); reduced motion uses immediate state switch.
- Original acceptance:
  - Static storyboard is not animation acceptance; actual motion and reduced motion remain to validate.
- Runtime operations: Actual 160ms (.2,0,0,1) animation, owner clipping, repeated/interrupted toggles and instant reduced motion.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 23 — Selection highlights

- Delivery: State adapters across consumers; phase 03–06.
- Owner: Shared state roles in shell/apps/editor/greeter.
- Original requirements:
  - Distinct normal, hover, pressed, selected, focused, disabled, invalid states.
  - Gold selection is an explicit background/text pair; focus is an outline.
- Original acceptance:
  - Show selected text on its real background; report contrast rather than assume readability.
- Runtime operations: Normal/hover/pressed/selected/focused/disabled/invalid; explicit foreground/background pairs, contrast on actual composite.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.

### 24 — Login screen

- Delivery: Separate SDDM theme; phase 06.
- Owner: SDDM Qt6 presentation; stock authentication/session launch.
- Original requirements:
  - Preserve monumental weathered navy/gold embossed eagle background.
  - Compact Judge Identification / Justice Department form, anElectricMonk, password, Sign in, Hyprland selector.
  - Require idle, focused, error, disabled and session menu states after layers exist.
- Original acceptance:
  - Preferred raster reference preserved. Background/emblem/UI must be separated before independent palette propagation.
- Runtime operations: Live heading/user/password/button/session menu; idle/focus/error/disabled/loading, wrong/correct credentials, actual Hyprland session start and restore.
- Evidence: consult the phase reviews linked from the project log; final area acceptance remains pending.
