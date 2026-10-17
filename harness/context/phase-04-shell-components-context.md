# Phase 04 context: shell presentation

## Reaffirmed window-card requirement — 2026-10-17

The user identified the missing overlay card as part of the agreed theme. It has
not been waived. The approved placement reference is
`output/mega-city-one-theme-concepts/supporting/Per-window information panels - approved placement reference.png`;
the shared implementation specimen is the `card()` function in
`output/mega-city-one-system-v3/build.mjs`. Area 04 of the specification owns the
204×120 geometry, 3px right inset and 12px gold tab; area 22 owns open/tucked states.

An attached card requires optional presentation code outside ordinary theme
settings. Existing native headers do not satisfy this requirement. Before claiming
delivery, establish real owner movement/resize/closure, stacking/visibility,
workspace/focus changes, input behaviour and departure from Drokk. Application
metadata needs a real source; specimen path, Git branch, status and folder counts
must not be presented as live values. This inspection corrected the evidence
classification only; no card plugin or live overlay was installed.

## Window-card implementation decision — 2026-10-17

The user authorised implementation, agreed tests for attached/tucked/input behaviour
and theme cleanup, and separately approved a finite isolated compositor check with
disposable windows. Use Hyprland's native decoration interface: owner lifetime,
movement and stacking belong to the compositor. A layer-shell overlay cannot meet
that contract without separate tracking and stacking machinery. No polling daemon
or replacement shell is introduced. The optional compiled plugin is explicitly
outside the ordinary theme and initially targets installed Hyprland 0.56.1.

| Operation | Owner | Check |
|---|---|---|
| Colour and font | Existing resolved package model; native card renderer | Shared model inputs; inspected rendered card |
| Movement, resize, stacking, close, fullscreen | Window-owned native decoration | Finite isolated compositor with real windows |
| Tuck/open and body click-through | Native decoration input; gold tab only | Real pointer test and owner geometry test |
| Enable, disable, theme departure | Existing exact-fragment session profile; `hl.plugin.load` | Session fixture plus native config unload/reload |
| Window title, workspace, active state | Compositor window model | Native window title and focus changes |
| Application path, Git branch, folder counts | No approved application data adapter | Remain unavailable; no specimen values shown as live |

The build uses installed native C++ tooling matching the compositor compiler,
with a runtime API/ABI hash check before touching compositor objects. Node uses
the project Mise pin. Package builds do not automatically compile or activate
the optional card. Execution status and limitations belong in the build log.

The rightmost tiled-window regression requires a reserved 10px right decoration
strip; unreserved input extents do not extend that layout hit area. The tab and
Super+Alt+I share one toggle/160ms animation path; native animations disabled
means immediate. Hyprutils owns easing and compositor damage drives the frames.
The profile owns the binding, while the plugin owns its Lua callback.
Super+Alt+I replaces the earlier Super+Shift+I choice: the latter is assigned to
previous input language in upstream Omarchy. Check the installed binding list
before activation; leave standard input-layout bindings untouched. The native
fixture keeps a separate Super+Shift+I action and verifies both chords independently.

Native updates must establish running-library identity: `-fno-gnu-unique` permits
real unload, and a SHA256 filename avoids reopening an older cached library.
On-disk equality alone failed to prove deployment on this host. The focused
native fixture now checks real unmapping, right-edge input at 1×/2× and keyboard
input. No application data adapter or global pointer interception was added.

The authorised normal theme-switch check exposed an IPC registration crash while
Quickshell was reloading changed plugin files. Keep those file writes inside the
existing session transaction, stopping the unlocked shell before publication and
restarting after commit or restoration. Lock guarding remains before this work;
there is no change to authentication policy. The exact upstream lifetime defect
remains unproven; the subsequent bounded live switch is recorded in the build log.

## hyprpm packaging decision — 2026-10-17

User authorised hyprpm packaging and explicit unsupported-version rejection.
Keep the existing install/theme-cleanup test boundaries. A generated standalone
source payload will contain the native source, shared-model-derived paint header,
manifest and one native build command; users need no Node runtime to compile it.
The same build command serves local development and hyprpm. Initially accept only
the tested Hyprland 0.56.1 commit; retain the runtime ABI hash check. No invented
plugin Git commit pins: this checkout has no release commit or remote yet.

hyprpm owns library install/update/load state. The existing Drokk profile owns a
native enabled setting and the shortcut. A manager-loaded library defaults to
inactive; theme departure removes decorations and input reservations even if the
library remains loaded. Direct local installation still supports actual unload.
Do not call privileged hyprpm enable/disable from every theme switch.

| Operation | Owner | Check |
|---|---|---|
| Standalone build / unsupported headers | Generated native build entry point | Actual compiler and alternate pkg-config header fixture |
| Install/update package metadata | hyprpm manifest and explicit accepted commit | Real manager parsing, temporary Git pins, build/update/refusal/removal in a namespace sandbox |
| Theme enable/disable with library resident | Existing profile and native config | Existing isolated compositor fixture, including hidden windows |
| Existing local install/remove | Existing card installer | Install preservation fixture and live profile identity |

The real manager fixture reuses the installed matching SDK. Its privileged file
commands execute as namespace-root within disposable mounts; it does not prepare
host headers, change the real cache or use host authentication. Source payload
builds need no Node/Mise runtime. Managed registration points at the inspected
0.56.1 cache path without copying the binary. The source guard rejects unknown
commits even when hyprpm falls back to latest Git; compiler and runtime ABI checks
remain. Actual release pins await real compatible source commits/publication.

## Earlier shell work (historical)

Current menu width decision: the user requested a narrower Super+Space root menu,
while keeping Super+Alt+Space Apps unchanged. The presentation adapter now selects
300px only for root and retains 360px for Apps/ordinary submenus and 520px for the
existing special routes. Live rendered border measurements at 2x and scoped
screenshots checked both root and Apps. No navigation or app-library logic changed.

Repository-local presentation work can proceed against the inspected installed
component contract. Phase 03 native desktop acceptance is still outstanding;
starting this source slice does not satisfy that dependency or activate anything.

The installed notifications service instantiates a separate NotificationCard with
app/appIcon/summary/body/image/glyph/urgency/timestamp/cornerRadius/fontFamily and
closeRequested/cardClicked signals. The service owns delivery, persistence,
timeout and invocation. Preserve that ownership; do not start a competing daemon.

| Operation | Owner | Check or gap |
|---|---|---|
| Card appearance | Generated shell/NotificationCard.qml | Public build palette probe; native offscreen render |
| Dismiss and default action | Card signals, existing service callbacks | Native component interaction; live service integration pending |
| Semantic category | Explicit kind property; critical urgency overrides | No guess from arbitrary message text; sender mapping pending |
| Delivery/history/stack | Installed Omarchy service | User-owned adaptation and isolated runtime still pending |

Use the approved model geometry (380px, 46px tiles, 10px corners) and shared
palette/font roles. Ordinary notification content is plain text, not executable
markup. The standalone component is not claimed as an installed plugin.

## User decision: standard theme and live comparison first

The user clarified that this must be an Omarchy theme rather than bespoke replacements. Use supported stock theme/configuration mechanisms first. Preserve all 24 design areas as comparison targets, but label unsupported exact geometry/behaviour as stock differences for review, not mandatory custom-component work. Companion extensions require a later decision. The user authorised live adjustment/comparison and explicitly approved the standard switcher background helpers. This supersedes the earlier isolated-first activation gate for this bounded live trial. Authentication/session policy and greeter activation remain outside this trial.

## Standard-only live tuning

User explicitly requested live standard settings until structural controls are exhausted.
Added canonical shell-settings.json for native font/spacing/bar/border values; menu
headings/title 16px, body/bar 14px, fixed 26px bar, left-only 3px selection edge.
Native layer blur with .2 threshold excludes menu scrim. Installed source owns
geometry/state; no cloned components enabled. All 24 areas mapped in
docs/standard-theme-boundary.md, separating applied settings from custom limits
and missing visual acceptance. Lock preview is native and non-authenticating.

## Bounded optional companions authorised

User accepted optional plugins with review/validation here, without an independent
human reviewer requirement. Start with megacity.menu: replace only the hardcoded
bar glyph, reuse stock menu and terminal actions and native button components.
Build packages plugins/ as siblings of theme/, so normal installation enables none.
Installed/validated/rendered the three-file plugin live; original menu entry retained
as small metadata and restoration/disable checked. Further full component forks
are not implied; reassess necessity and boundary before adding them.

## 2026-10-17 finishing scope

The first four authorised finishing areas are implemented and checked live/native.
Current decisions, boundaries and evidence are in docs/live-feature-status.md.
Real SDDM login and final companion lifecycle/full 24-area review remain deferred.
