# Standard-theme live tuning and remaining boundary

Historical stage record, retained for decisions and earlier evidence. It is not
the current installation guide. See [current live status](live-feature-status.md)
and [compatibility](compatibility.md). Later authorised companions supersede the
standard-only boundary described below.


This records the installed Omarchy version's controls, not a promise that every
mockup detail is a theme option. User instruction: exhaust standard settings;
stop before companion/custom components. No plugin QML was installed during that standard-only pass.

## Changes applied in this tuning pass

- Shared shell-settings.json supplies supported bar/font/spacing/border settings.
  Bar is 26px without automatic font scaling. Body/bar type is 14px; menu heading,
  title and subtitle are 16px. Existing machine override base-size=14 is retained.
- Gold selected menu/launcher rows use a 3px red left edge, with other row edges
  zero. Blue-grey card borders are 1px. Stock geometry remains rectangular.
- Foot main and all style slots use regular Share Tech at 16px. This is a user
  setting because its font assignment overrides the theme include. Existing windows
  need reopening; no running terminal session was killed.
- Native Hyprland layer blur targets menu, notifications and keyboard panels with
  ignore_alpha=0.2, excluding transparent areas and the menu's .15 scrim. Native
  compositor reports blur enabled, size 8, border size 2; reload has no errors.
- Native menu/notification composition captured and inspected in
  harness/evidence/live-standard-menu.png. Stock lock preview captured and inspected
  in harness/evidence/live-standard-lock-preview.png. Preview never authenticates.

## All 24 areas

| Area | Standard result / evidence | Remaining difference |
|---|---|---|
| 01 Wallpaper | Selected existing city wallpaper active | No wallpaper redesign requested |
| 02 Palette | Shared navy/cream/gold roles active | App-owned surfaces are not universal palette consumers |
| 03 Borders | 2px gold/blue-grey; live compositor checks | None identified for the basic border design |
| 04 Window appearance | Native rectangular windows; opaque content | Universal titlebars and attached comic cards need other presentation code |
| 05 Terminal | Full palette, selection, cursor and .92 background configured | Reopen existing terminals for font adoption; full ANSI visual acceptance pending |
| 06 Terminal font | Share Tech resolves natively; Foot regular slots 16px | Other terminal user sizing may differ; no fake font identity |
| 07 Launcher | Stock Apps view with tuned sizes/gold/red-left selection | Search icon/header, fixed five shortcuts, independent radii and exact dimensions are not exposed |
| 08 Bar | Navy/cream/red, 26px, supported layout retained | Eagle menu logo is hardcoded glyph; per-widget enabled/urgent distinctions cannot all be remapped globally |
| 09 Notifications | Stock service, navy .94 background, cream text, blue-grey border; live capture | Semantic tiles, permanent X, positioned links and per-role family/sizes need a different view |
| 10 Lock | Native preview shows blurred wallpaper and gold field | Live clock/date/eagle/user/button composition is absent; no settings expose it |
| 11 GTK apps | Standard adapter selects Adwaita-dark | Exact navy/gold app surfaces require separate GTK styling; not applied |
| 12 Qt apps | Existing platform integration retained | Exact palette/widget styling not supplied by normal Omarchy theme; not visually accepted |
| 13 Icons | Existing Yaru-blue icon theme remains selected | Exact folder geometry/eagle assets need a separate icon pack or small widget change |
| 14 Cursor | Existing native cursor retained | Complete gold cursor family is a separate asset theme; three concept samples are insufficient |
| 15 Neovim | Active theme link wired; native Aether checks passed | Visible editor acceptance not performed in this pass |
| 16 File managers | Native GTK appearance; Yazi uses terminal colours | Exact Files styling and Yazi semantic roles need application-specific configuration |
| 17 Monitor | btop current.theme links to generated native theme | Dynamic monitor visual acceptance pending; no replacement monitor needed |
| 18 Browser | Chromium/Chrome managed theme colour is #0e1822 | Firefox is outside stock adapter; independent chrome role fidelity is limited |
| 19 Fonts | Share Tech active; supported shell size tokens applied | Stock notifications hardcode Liberation Sans; theme tokens cannot select Plex there |
| 20 Effects | .92 terminal/.94 menu-notification alpha plus scoped native blur | Mathematical blur equality to illustration is not asserted |
| 21 Workspaces | Stock dynamic workspace widget preserved | Minimum five IDs and focused glyph are hardcoded, not a four-box theme option |
| 22 Transitions | Existing stock/compositor motion retained | Comic-card storyboard has no stock component to animate |
| 23 Highlights | Shared gold/dark selection and native focus roles | Exact states remain application-specific; not every third-party app adopted |
| 24 Login | Existing SDDM omarchy theme unchanged | Main.qml hardcodes its layout/font/assets and theme.conf has no relevant controls; separate greeter theme required |

## Why these are boundaries

Installed Menu.qml fixes its view structure and derives dimensions from shared
Style.space; there is no independent fixed-shortcut/row-radius/search-header setting.
The menu BarWidget.qml hardcodes the Omarchy font glyph. Workspaces.qml hardcodes
its initial IDs and focused glyph. NotificationCard.qml fixes text-family/layout
and only exposes the documented data signals and shell colour roles. LockView.qml
contains a blurred wallpaper and password input, not clock/user/emblem/button items.
The installed SDDM Main.qml references fixed artwork and font values, not configurable
background/form fields. No packaged files have been changed to bypass these limits.

Supported numeric/colour settings can always be adjusted further by taste. The
structural differences listed above cannot be solved merely by trying more values.
This is a standard-theme boundary assessment, not completion of the full original
24-area goal or acceptance of the differences by the user.
