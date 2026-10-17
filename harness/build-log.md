# Project build log

This is the theme project's implementation/evidence record, not a machine log.
[Plans](../PLANS.md) own scope and sequence; [workflow](../PROMPTS.md) owns procedures.

| Phase | Status | Branch | Started | Completed | Evidence | Blockers |
|---|---|---|---|---|---|---|
| 00 Plan/harness setup | Complete | main (unborn) | 2026-10-17 | 2026-10-17 | [Context](context/phase-00-plan-context.md) | None |
| 01 | In progress | main (unborn) | 2026-10-17 | — | [Context](context/phase-01-specification-and-baseline-context.md) | Matching isolated environment not established |
| 02 | In progress | main (unborn) | 2026-10-17 | — | [Context](context/phase-02-shared-build-and-package-context.md) | Native integrations and isolated environment pending |
| 03 | In progress | main (unborn) | 2026-10-17 | — | [Context](context/phase-03-native-desktop-context.md) | Isolated native desktop and remaining adapters pending |
| 04 | Not started | — | — | — | — | — |
| 05 | Not started | — | — | — | — | — |
| 06 | Not started | — | — | — | — | — |
| 07 | Not started | — | — | — | — | — |
| 08 | Not started | — | — | — | — | — |

## 2026-10-17 — Phase 00: planning setup

- Authorised scope: user asked for Proof-derived plan and working-theme goal;
  subsequently authorised Git here. Documentation, .gitignore and Git initialisation.
- Observed baseline: workspace held output/ and no Git repository. git init -b main
  succeeded; no commit, remote or push. Existing design files preserved.
- Changes: goals, workflow, eight bounded phases, 24-area coverage map, phase context,
  README and repository instructions adapted from inspected Proof sources.
- RED/GREEN/refactor: runtime tests not applicable to planning-only changes.
- Verification: pending document/link/scope checks. No theme build, VM run, installer,
  authentication test or host activation is claimed.
- Review/limits: exact production commands and VM setup remain Phase 01/02 work;
  source promotion is required before standalone release.
- Next action: validate these documents, then hand over the plan. Implementation
  phases remain Not started.

## 2026-10-17 — Phase 00: document verification complete

- Status: In progress → Complete (planning only). Implementation phases 01–08 remain Not started.
- Verification: observed `mise exec -- node --input-type=module` document checker reported 16 documents, 60 existing local links, eight correctly sectioned phase plans, all 24 area IDs and `findings: []`; exited 0. The checker inspected all new Markdown because ordinary Git diff does not include untracked files.
- Observed `git diff --check` exited 0 (tracked diff empty); separate new-file whitespace check passed. `git status --short` showed only the new harness/root documents and .gitignore; `git branch --show-current` reported main; `git remote -v` produced no entries.
- Review: plans distinguish proposed tasks from available commands, retain all 24 areas, require clean source promotion, live UI/native authentication and verified rollback, and keep target activation separate from planning authority. No Proof source or existing output files changed by this setup.
- Limits: no Python strict harness-validator run, because Python has no selected runtime and this planning step introduced no runtime configuration. Node document checks establish structure/links only, not semantic correctness or a working theme. No product tests, VM provisioning, package install, theme activation, commit or push.
- Next action: Phase 01 specification/baseline audit when implementation begins; the working-theme goal remains open.

## 2026-10-17 — Phase 01: source promotion and native contract audit

- Status: Not started → In progress. Authority: active user goal continuation; repository-local audit/source promotion, no desktop changes.
- Changes: copied 27 canonical assets/models/font/reference files with origin/role/SHA-256 manifest; expanded all 24 original requirement sets into docs/mega-city-one-spec.md with owners and native operations; added asset/licence and environment notes plus 13 installed component fingerprints. Node 26.7.0 is project-pinned through Mise, already installed.
- Observed runtime check: mise current node returned 26.7.0; mise exec -- which node resolved the exact versioned Mise installation. No installation. Nine current-user path/type/hash records retained locally without file contents; this is not a restorable backup.
- RED/GREEN: not applicable to source/document promotion; no production behaviour implemented. The first document writer failed at JavaScript parse time before writes; corrected by separate document writes. Initial link/hash checker confirmed copied file equality and palette validity, then failed on an over-deep README relative link; corrected. Final check pending below.
- Findings: custom launcher/notifications/cards, full cursor, GTK/Qt styling and separated authentication assets remain real implementation work. Stock lock preview is non-authenticating; greeter test mode is not session-start proof.
- Limits: no VM image/runtime established or launched, no shell preview/lock, no SDDM login, no theme activation, no commit/push. No phase completion claimed.
- Next action: finish source/document validation and establish a concrete matching ARM64 isolated setup before closing Phase 01.

## 2026-10-17 — Phase 01: source checks passed, environment pending

- Status: In progress → In progress; matching isolated environment still unresolved.
- Observed verification: `mise exec -- node --input-type=module` source/document checker exited 0 and reported 27 promoted files (22,069,884 bytes), matching original and promoted SHA-256, 125 valid colour slots, 39 valid alpha controls, ordered 24-area coverage, 22 Markdown documents, 70 existing local links, nine unchanged user-config path fingerprints, and findings: []. Receipt: harness/evidence/phase-01-source-check.json (local ignored evidence).
- `git diff --check` exited 0; new-file whitespace was checked separately by the Node checker. `git status --short` lists only new repository harness/docs/source/runtime-pin files; no tracked source baseline commit yet.
- Review: all original design requirements remain in the detailed contract. Native schema facts are supported by 13 hashed installed components. OFL font notices preserved; Nimbus remains an explicit external dependency with upstream licence URL. Unresolved artwork separation, complete cursor and custom layouts remain explicit future work, never passed off as native configuration.
- Limits: structural/source validation does not prove a working theme or live authentication. No VM/service started and no desktop configuration changed. Phase 01 remains open; no unsupported completion or blocked status recorded.

## 2026-10-17 — Phase 02: synchronous package and lifecycle implementation

- Status: Not started → In progress. Dependency clarification: verified Phase 01 source/specification work permits offline package/fixture work while the isolated runtime remains unresolved. Goal and native/target gates unchanged.
- Changes: build/check/install/remove CLI, explicit registered tokens, native palette/shell output, generated eagle/folder, existing background, font bundle/notices, package-local HTML preview, per-token runtime-coverage report and deterministic hashed manifest. Added documented Mise tasks and fixture-only installer.
- Observed RED/GREEN: initial build rejected as unimplemented; shell output absent; check command absent; install target option absent; update unsupported; interrupted receipt file wrongly removed; redirected backup wrongly restored; empty manifest wrongly accepted. Each failing public-seam case was observed, implemented/remedied and then passed.
- Final verification: mise run theme:test exited 0, 10 tests passed serially. Covers token propagation, invalid inputs, reproducibility/integrity, dry-run, install/reapply/update/remove, original restoration, user-edit and backup protection, failed update preservation and unrecognised recovery state. No mocked filesystem collaborators.
- Observed mise run theme:build and mise run theme:check exited 0: 16 payload files. omarchy theme color --file dist/mega-city-one/theme/colors.toml accent returned #D1B472. This is parser/format evidence only.
- Visual evidence: foreground Chromium generated harness/evidence/phase-02-package-preview.png; actual image inspected. Dumped DOM reported data-fonts-ready=true and Bundled fonts loaded. This is a package specimen, not native desktop acceptance.
- Review: synchronous AI-slop review scoped to four script modules, CLI fixture tests and source token registration. Fixed prior-transaction deletion, redirected-backup acceptance, empty payload acceptance and duplicated backup check; retained regression coverage. Review details in code_review/phase-02-package-review.md.
- Limits: native application adapters, custom shell geometry, authenticating lock/SDDM, host installation and crash/power-loss recovery remain unverified or unimplemented. Installer explicitly refuses the actual user HOME and never changes active-theme/background links. Source/model preview is not the previous full desktop studio. No VM/service/host change, commit or push. Phase 02 not complete.
- Next action: complete native adapters and the separate extension/lifecycle contracts while preparing an authorised isolated runtime; retain Phase 01 environment and final native/target acceptance gates.

## 2026-10-17 — Phase 02: handoff validation

- Status: In progress → In progress. Final product/phase completion remains unproven.
- Observed final document/baseline checker (mise-selected Node) exited 0: 26 Markdown documents, 78 local links, nine original user-config path fingerprints unchanged, findings: []. `git diff --check` exited 0; new-file whitespace checked separately. Git remains unborn main with repository-local untracked changes and no remote/commit/push.
- Final package output is approximately 7.5 MB and contains 16 payload files plus manifest. Current source/test hashes are retained in harness/evidence/phase-02-checks.json. Required runtime gaps remain in preview/coverage.json and the 24-area specification.
- No test or tool handle remains running from this work. Next work is native adapter implementation and concrete isolated-runtime preparation, keeping authentication and host acceptance requirements intact.

## 2026-10-17 — Phase 03: native terminal and desktop configuration

- Status: Not started → In progress. Active goal continuation authorises source-only adapter work; existing package/lifecycle seam is verified. Full Phase 01 isolation and Phase 02/03 completion gates remain outstanding. No host activation.
- Changes: generated Foot/Ghostty/Kitty/Alacritty palettes, cursor/selection/background alpha and regular Share Tech font slots; Hyprland rectangular borders/blur/default-opacity cancellation; btop semantic graph/state roles; Neovim/Aether syntax/diagnostic/selection overrides; package-local Fontconfig; repeatable theme:check-native task.
- RED/GREEN: public build tests initially failed on missing foot.ini and hyprland.lua; minimum adapter implementation then passed palette/cursor/alpha/font and border/graph/syntax/font probes. Final mise run theme:test exited 0 with 12 tests passed serially.
- Observed mise run theme:build and mise run theme:check exited 0: 24 payload files. mise run theme:check-native exited 0: Foot/Ghostty parsers accepted output, Hyprland --verify-config accepted the Lua, Fontconfig resolved the bundled Share Tech file, and a clean headless Neovim/Aether load reported expected background/syntax/diagnostic/selection colours without synthetic faces. Native check subprocesses used temporary HOME/XDG config/data/state/cache, finite deadlines and no GUI.
- Parser controls: isolated invalid Foot alpha returned exit 230, invalid Ghostty opacity exit 1 and invalid Hyprland setting exit 1; all reported errors. This establishes validator sensitivity, not a desktop test.
- Review/limitations: point sizes outside Foot use explicit 96dpi conversion; user terminal/font and Hyprland overrides may take precedence and still require reversible integration. Native blur is not asserted identical to Gaussian preview radius. Kitty/Alacritty executables absent; btop visual rendering, GTK/Qt, Files, browser, complete icons/cursors and comic-card layouts remain pending. Headless Neovim uses the existing installed Aether v3 API, not a newly downloaded plugin.
- No current theme/background links, user config or live services changed. No VM/compositor/app window started by the checks. No commit/push. Next action: finish remaining native adapters and reversible application settings while preparing isolated runtime approval; preserve all 24 requirements.

## 2026-10-17 — Phase 03: handoff checks

- Observed final Node document/baseline checker exited 0: 29 Markdown documents, 84 existing local links, nine original config path fingerprints unchanged, findings: []. git diff --check exited 0; new-file whitespace checked separately. No tool/process handle remains running.
- Phase 03 remains In progress. Native output and parser/headless checks are concrete progress; actual isolated desktop and target acceptance are still missing. No goal-completion or blocked claim is made.

## 2026-10-17 — Native applications/settings and notification presentation

- Phase 03 remains In progress. Phase 04 source presentation started; full Phase 03
  acceptance remains a dependency, not satisfied by offline component work.
- Added application outputs, fixture-only Foot/font discovery configuration and
  native GTK parser checks. Python 3.13.15 is project-pinned alongside Node 26.7.0;
  mise current and mise exec -- which node python confirmed selected runtime paths.
  An initial mise current node python command was rejected for extra argument;
  mise current then confirmed both versions.
- Recovery RED/GREEN: redirected ownership receipt restoration incorrectly
  succeeded (test exit 1). Guarding the receipt with existing rejectSymlinks made
  the focused three-test restoration run pass. Strengthened user-edit test verifies
  actual original backup and receipt bytes remain intact.
- Notification RED/GREEN: public build probe failed on missing NotificationCard.qml;
  added shared-source native QML/icon output and probe passed. Component retains
  stock property/signal boundary; service integration is not yet implemented.
- Observed mise run theme:build passed (36 payload files). mise run theme:test
  passed 18 tests. mise run theme:check-notification passed five native QtTest cases
  including lifecycle setup/cleanup, real mouse controls, long text and critical
  urgency; actual native download capture inspected at harness/evidence/notification-download.png.
- Observed mise run theme:check-native passed Foot/Ghostty/Hyprland, font lookup,
  Neovim/Aether, GTK3/4 CSS, Yazi syntax and fixture font adoption/restoration.
- Yazi disposable terminal trials displayed default colours; not accepted as theme
  adoption. GTK/Qt/browser appearance, notification service integration and the
  full isolated/target desktop/lock/login remain outstanding. No live configuration,
  service, authentication, packaged Omarchy source, commit or push changed.
- Documentation patch initially failed its final build-log context match and applied
  no files; corrected through explicit append/new review writes. Next: isolated
  shell integration and launcher, retaining full native/target acceptance gates.

## 2026-10-17 — User-directed standard theme/live trial

- User rejected bespoke replacements as the default delivery approach. Parked
  launcher/notification QML, native fixture tests and runner outside the build;
  removed generation/tasks for those prototypes. Standard build passed: 30 files.
  Native parser/font/editor checks passed after removal.
- User explicitly authorised live adjustment and standard switcher's own background
  helpers. This supersedes isolated-first activation for this bounded trial;
  companion extensions remain a later decision. All 24 areas remain comparison
  targets; exact unsupported mockup details are no longer automatic custom-code work.
- Preserved current osaka-jade theme/wallpaper and terminal/font settings privately
  under /home/swa/.local/state/thememe/live-trials/2026-10-17T14-00-13.545Z. Staged only standard-supported files in the user theme directory.
- Observed omarchy theme set mega-city-one exited 0; omarchy font set
  ShureTechMono Nerd Font Mono exited 0. User-local font and licence installed.
  Queries confirmed theme, font, #0E1822 background, #D1B472 accent and no Hyprland
  configuration errors. Opened actual stock Apps menu via omarchy menu summon apps;
  native live capture inspected. Existing terminal windows still need font reopening.
- Stock launcher is rectangular/alphabetical, not our compact prototype. Live trial
  is active for user review, not final acceptance. No custom plugin or greeter/auth
  modification; live rollback not exercised. See docs/live-trial.md.

- User requested cleanup: removed redundant Osaka Jade active-theme copy and wallpaper copy from the live-trial recovery folder (approximately 6 MB). Retained original personal font-settings files and small metadata. Active Mega-City One and installed Osaka Jade unchanged.

## 2026-10-17 — Standard-only live tuning

- User instructed continued live tuning with standard settings only, stopping before
  bespoke work. Added canonical shell-settings.json; build merges native settings
  and resolves size references from typography.json. Active and user theme copies
  updated from generated output, then supported applyTheme IPC returned ok.
- Set bar/body 14px, menu heading/title/subtitle 16px, fixed 26px bar, 1px card edges
  and 3px red left selection border. Foot main/style slots set to regular Share Tech
  16px; native Foot config check passed. Original personal settings remain preserved.
- Native layer blur rule added using documented hl.layer_rule blur/ignore_alpha;
  native validation and live reload passed. getoption returned blur true, size 8,
  border size 2. No Hyprland config errors.
- Observed standard menu/notification live capture and stock non-authenticating lock
  preview after allowing a render frame. Early captures occurred before the overlay
  rendered or on the other output; they were not accepted and unrelated-content
  captures were deleted. One legacy focusmonitor dispatch failed Lua parsing;
  installed hl.dsp.focus monitor syntax succeeded. Final task-only captures inspected.
- Native source audit confirms remaining menu/workspace/logo/notification/lock
  structure limits; SDDM Main.qml is fixed and theme.conf exposes no relevant fields.
  GTK is Adwaita-dark, icons Yaru-blue; native Chromium/Chrome policies contain navy.
  Existing machine base-size override 14 preserved.
- Observed theme:build/check passed (30 files); theme:test passed 17 tests; native
  parser checks passed after layer-rule change. Cosmetic tuning uses native visual
  checks rather than extra implementation-mirroring tests. No custom plugin installed,
  packaged source edit, actual lock/authentication, logout or greeter activation.
- All 24 standard results/limits now mapped in docs/standard-theme-boundary.md.
  Original full goal remains unproven; structural differences need user decisions.

## 2026-10-17 — First bounded companion: eagle menu button

- User authorised optional narrow plugins and removed an independent-human-review
  prerequisite. Added megacity.menu 0.1.0 with only manifest, native bar widget and
  canonical eagle SVG. Existing Omarchy menu/terminal logic retained; no service.
- Reused package builder with optional plugins/ sibling and narrowly allowed path;
  normal theme installer still copies theme/ only. Initial focused test failed on
  absent separate builder; simplified into the existing build seam and passed.
- Observed theme:build passed (33 payload files), staged and installed omarchy plugin
  validate exited 0. First enable attempt was rejected before discovery completed;
  subsequent registry query showed the disabled plugin and enable succeeded.
- Actual native bar capture inspected: gold eagle replaces only original menu glyph.
  Companion is enabled; built-in menu remains available and ping returns ok. Stock
  button restoration, companion disable and re-enable succeeded through standard
  commands. Per-entry original position/settings retained without whole-theme backup.
- Source review covers two fixed user-click commands, no network/file/credential/root
  operations and qualified palette binding. Exact tested component versions recorded
  in docs/companions.md. No physical-click/terminal-open automation performed, no
  broad compatibility/security claim, no public release/licence claim or custom auth.
- Full theme goal remains open. Next companions require a specific benefit and small
  boundary; no revived custom launcher/notification service by default.

- Final verification for this companion: mise run theme:test exited 0 with 18 tests; theme:check passed 33 payload files; native plugin validator and git diff --check exited 0. No tool session remains running.

### 2026-10-17 — correct shared menu boundary

- User confirmed root and Apps should retain different functions but share styling.
- Replaced the separate Apps release payload with a pinned native menu clone in
  megacity.menu. Seven presentation substitutions; MenuModel.js unchanged.
- Disabled megacity.launcher and removed its exact owned binding block from the
  user's bindings.lua. Stock Super+Space and Super+Alt+Space routes restored.
- Observed: mise run theme:test passed 20 tests; theme:build/check passed 48 files;
  theme:check-shell passed 6 Qt entries (notification only after retiring launcher).
  omarchy plugin validate accepted the generated menu; hyprctl configerrors empty.
- Restarted shell, opened root and Apps through normal omarchy menu commands, and
  inspected scoped card captures. Initial captures before the final shell reload
  did not show the menu and were not treated as acceptance. Final captures do.
- No application launch, authentication or destructive command tested. The wider
  Mega-City One goal remains unfinished.

### Asset fidelity correction

User requires pixel-perfect reuse, no redraws. Removed newly drawn lock SVG and
regenerated login artwork from canonical assets. Lock companion excluded from
package pending exact artwork; unfinished view source retained, not activated.
Approved lock PNG verified byte-identical to historical source. Older approved
SVG is a filtered screenshot and does not qualify as an exact standalone asset.
Native lock view fixture previously passed submit/clear and disabled guard after
fixing generator syntax and fixture shutdown; no authentication was exercised.

### 2026-10-17 — original-art lock/login implementation, acceptance incomplete

- User requires no redraws and exact original assets. Added unchanged reference
  PNGs to canonical assets and fixed approved SHA256 checks at package seam.
- Login public package test first failed ENOENT, then passed after separate SDDM
  theme implementation. Entire original artwork retained; live opaque form hides
  painted fields; tiny insignia uses original source region. Bundled local fonts
  and actual OFL notices. No greeter install/activation or policy changes.
- Native LoginForm checks pass submit/clear, busy duplicate guard and failure
  focus/recovery: 3 Qt entries including setup/cleanup. Source checks pass.
- SDDM --test-mode loaded real session/user models on both monitors. Initial short
  runs produced no captured window; direct item capture from a test-only copy
  succeeded at 1728x1080 and 2400x1350. Final images inspected. Preview bounded by
  timeout (exit 124), not falsely reported as process success. Missing socket is
  expected in test mode; no live authentication performed.
- Lock view and pinned untouched Service.qml now packaged separately. Exact PNG
  shown through sourceClipRect; native view-only runner passed submit/clear and
  disabled guard without loading PAM/WlSessionLock. Manifest validator passed.
- Lock preview exposes a city rectangle around eagle. This is a visual blocker;
  no lock companion activation. User question about background removal pending;
  no permission to remove/recolour eagle pixels inferred from elapsed time.
- Observed final checks: theme:test 22 passed, theme:check 64 files, focused fixed
  artwork hash checks 2 passed, theme:check-login 3 Qt entries, theme:check-lock
  success marker/exit 0. git diff --check clean (unborn tree; not a full new-file
  review). Source review records remaining acceptance gaps explicitly.

### 2026-10-17 — approved lock transparency and activation

- User explicitly approved background removal only and activation. Deterministic
  magick extraction retains all original crop RGB samples (raw RGB comparison
  passed); alpha removes city background. No image generation/redraw/recolour.
- Disabled lock-view blur and contrast alteration. Native view preview passed
  submit/clear and disabled guard and was visually inspected without rectangle.
- Plugin validator passed. Confirmed installed stock Service.qml byte-identical
  to pinned source. Session unlocked before activation and shell restarts.
- Initial enable requested rescan; rescanned and enabled successfully. Stock lock
  disabled, megacity.lock enabled. Fresh native status reports passwordPam true
  and two screens. Live native preview captured on its actual monitor and inspected.
  An initial capture targeted the wrong monitor and was deleted without inspection.
- theme:test 22 passed, theme:check 64 files; live Service.qml/LockView.qml/emblem
  match generated package. Removed unused full screenshot from runtime payload;
  approved original remains in canonical sources. Small per-plugin recovery
  metadata retained; no stock theme backup or authentication-policy changes.
- No real lock or password authentication triggered. Next normal user lock/unlock
  is target acceptance; preview and unchanged service do not establish that test.

### 2026-10-17 — SDDM theme installed and selected

- User explicitly said do it after next-login installation proposal. Checked
  package and native login form again: theme:check 64 files, 3 Qt entries pass.
- sudo noninteractive unavailable; used authorised system pkexec dialog. Reviewed
  foreground install script passed bash -n, refused overwrites/symlinks, installed
  10 root-owned files, compared bytes and checked read access as sddm.
- Added only /etc/sddm.conf.d/99-mega-city-one.conf selecting mega-city-one. Stock
  10-theme.conf remains Current=omarchy; no /etc/sddm.conf override present.
- Post-install verification: all 10 files match package, ownership root, no group
  or world writes. Selection root:root 0644; theme directory root:root 0755.
  display-manager remains active. No SDDM restart/logout/reboot initiated.
- Small file-hash/selection recovery receipt saved under existing per-companion
  state. Rollback removes owned 99 selection override, restoring stock choice.
- Real user login/session acceptance pending next normal login. Separately, user
  confirmed real lock/unlock worked nicely; native status returned unlocked.

### 2026-10-17 — bounded notification action correction and wallpaper additions

- User requested removal of generic Open actions, then stop with outstanding list;
  added request to include five supplied photorealistic wallpaper PNGs.
- Removed invented Open for exec notifications and empty native default-action
  labels. Only an explicit sender-provided default-action label is shown; native
  whole-card action behaviour unchanged. No notification geometry changes.
- Build 69 files; 22 package tests and 6 native notification Qt entries passed.
  Applied only generated notification Service.qml; restarted shell while unlocked.
  Controlled local exec notification captured and inspected: no generic link.
- Five original 1672x941 PNGs copied unchanged to canonical assets/backgrounds,
  generated package, installed theme and active theme. RGB/image contents not
  modified. Provenance retained; all four locations byte-match Downloads originals.
- No wallpaper-switch command was run. Last observed current background link is
  02-necropolis-river.png. User live selection was not overwritten by this task.
- Remaining features unchanged: notification gap/placement and real status mapping,
  behaviour acceptance; GTK/Qt/Files/icons/cursor; bar/workspace states; visible
  terminal/editor/btop acceptance; first real greeter login; bounded companion
  install/update/remove and complete 24-area reconciliation. Stop after this slice.

### 2026-10-17 — finish four authorised live appearance areas

Implemented notification category/spacing metadata, GTK/Qt/Files styles, canonical
folder overlay and Xcursor family, bounded status clones/workspaces and native
terminal/editor/btop/Yazi adoption. Detailed observed evidence and limitations:
docs/live-feature-status.md. Final build/check: 191 files; native cursor 48 cases;
Qt shell 8 entries; private-bus notification callback/dismiss/DND/history/expiry
passed. Inspected native captures; workspace 4 focus and restore to 2 passed.
Latest notification/CSS/icon assets synced live; shell restarted unlocked.
No wallpaper change, real login test, final lifecycle or full 24-area review.

Final focused verification: ten selected package tests passed (no full lifecycle
suite). theme:check-native passed Foot/Ghostty/Hyprland, fonts/Aether, GTK3/4
CSS and Yazi checks, including its existing isolated font-adoption/restoration
fixture. This was not final companion installer/removal/theme-switch acceptance.
README lists native cursor build dependencies; theme:check-cursor added.

### 2026-10-17 — review corrections, code and fixture scope

Fixed all four review findings: exact-baseline checks with stock fallback for
lock/notification services; bar-patch preflight and write-failure restoration;
shared full-path symlink checks; ordinary package selects stock Yaru-blue icons.
Added protection against adopting subsequent user edits into the bar receipt.
Observed RED for later recovery conflict, stock-icon selection, user-edit
protection and invalid custom-QML fallback, then GREEN after corrections.
Native guard fixture verifies post-creation property injection and custom/stock
selection. Corrected test runner from standalone Qt to actual Quickshell because
Qt runner cannot load the Quickshell runtime plugin. One assertion was updated
to match the valid JSON receipt used by the write-failure fixture.
Seven focused safety tests, four package regression tests, eight native card
entries, private notification behaviour and non-authenticating lock view passed.
Build/check: 197 files. Documentation: docs/compatibility-and-safety.md.
No live helper invocation, plugin sync/restart, authentication or deferred
companion lifecycle/full 24-area acceptance performed.

Follow-up: added theme:check-safety and included all *.test.mjs in the normal
test task. Final seven safety tests passed after checking normal process exit
status and resolving the timeout fallback before stopping the process. Rebuilt
and checked final 197-file package; no live sync was performed.

### 2026-10-17 — apply reviewed service compatibility live

User explicitly requested live application. Verified package (197 files), both
host compatibility guards and unlocked session. Live service bytes matched the
reviewed pre-guard cores. Saved only two original service entry points and hashes
under local live-service-compatibility recovery state. Installed dependencies
before atomically replacing entry points; restarted shell unlocked. Custom icons,
cursor, wallpaper and SDDM selection were not changed. Lock status and notification
ping were checked after restart; real login/lifecycle acceptance remains deferred.

### 2026-10-17 — additional supplied wallpaper

Added Giant Judge, Liberty, and Shadowed Steps PNG unchanged as
06-giant-judge-liberty-and-shadowed-steps.png. Original dimensions and SHA256
recorded in backgrounds provenance. Build/check passed with 198 files. Source,
build, installed and active-cache wallpaper bytes match. No background switch
or other theme setting change was performed.

### 2026-10-17 — documentation cleanup and open licensing

Rewrote the README, companion/package/native/testing/authentication/status and
asset guides to remove stale current-state claims. Added a documentation index,
troubleshooting guide, compatibility matrix/checklist and two unchanged native
QA screenshots with explicit specimen/privacy/installation limits. Historical
standard-only/trial records are marked as history; plan/goal authority reflects
later explicit activation and the remaining user-deferred acceptance.
User authorised openness of original work including artwork, then explicitly
removed attribution requirements. Original code/docs/configuration use 0BSD;
original artwork uses CC0-1.0. Added root grants and a third-party notice inventory;
bundled MIT/OFL notices are unchanged. No public publication was performed.
Rechecked installed component package identities. Consulted upstream Quattro
theming documentation: Git-installed themes filter executable overrides, unlike
the inspected local theme-set script. Recorded this as a distribution-route
compatibility gap, not an observed test result or local behaviour. Public-release
payloads must carry the licence material alongside existing component notices.
Validated 91 local Markdown links and consistent original-project licence
references. Existing generated package check passed with 198 files. No product
code, live settings, authentication, service restart or deferred acceptance test
changed during this documentation work.

### 2026-10-17 — Drokk switching, formerly excluded acceptance, Dune refinements

User authorised the previously excluded lifecycle/login work and requested automatic
removal of extras when selecting another theme. Later steering requested Dune's
border pulse in our colours and Dune-sized bar icons. All work synchronous.

Implemented a user-owned native theme-set hook with serialized execution, stale
hook detection, lock-state refusal, owned fragment restoration, saved preferences,
explicit disable/enable and missing-companion stock fallback. Migrated 17 appearance
fragments from actual recovery records; the known iCloud symlink resolves to its
existing source checkout. No original transparency snapshot existed: first departure
explicitly restores the normal opaque bar. No packaged Omarchy files changed.
Renamed the live theme folder to drokk and adjusted the owned GTK imports; retained
internal package/plugin IDs. Shared user-file helpers are reused by older installers.

Observed RED/GREEN: repeated activation baseline, bar transparency, settings-failure
recovery, explicit disable persistence, native icon reapplication and missing plugin
fallback. Owned edits, new user files and symlink refusal are covered. A disposable
copy of the actual 17-fragment profile passed departure, byte-exact return and second
departure. Native Dune/Mega-City One and later Dune/Drokk switching restored stock
widgets/services, native icons and original cursor/font; personal plugins remained.

Live native companion removal initially asserted before the asynchronous catalogue
scan completed; catch recovery restored all removed directories. After a finite
scan wait, scripts/check-companion-lifecycle.mjs --live-profile passed removal of
all eight through Omarchy, stock lock/notification availability while absent, clean
reinstall, native manifest validation and inactive discovery. Verified temporary
native backups were removed. Public Git-plugin updates were not exercised.

Dune source showed native borderangle speed 28, once, bezier (0.35,0)/(0.65,1).
Generated Drokk uses those timings with shared gold/pale-gold/bronze colours.
Hyprland reload/configerrors and active gradient/animation values verified. The
small icons came from patched Share Tech glyph metrics. Bundled original Share Tech
Mono from Google Fonts with OFL/provenance, keeping terminal patched Share Tech;
fontconfig now resolves shell text to Share Tech and icon glyphs to JetBrains Nerd
Font. Bar height is 28; eagle uses native icon dimensions. Final bar captures inspected.

Observed verification: mise run theme:build and theme:check (200 files); mise run
 theme:test (41 passed after correcting the stale lock-entry-point assertion);
final node --test tests/theme-session.test.mjs (11 passed including newly added
missing-component fallback); mise run theme:check-native passed; theme:check-login
3 native Qt checks passed. All ten installed SDDM files match package hashes and
root/readability expectations; stock selection intact. Immediate IPC after a shell
restart briefly returned Target not found; later lock status and notifications ping
returned normal results. Actual login and post-guard real unlock were not performed.

Added complete 24-area reconciliation and updated current documentation/authority.
AI-slop review recorded in harness/code_review/theme-switch-lifecycle-review.md.
Remaining: user's real logout/authentication/session-start check; clean public install
and other-host compatibility; per-area limits in docs/acceptance.md. No new VM,
privileged greeter mutation, credentials, commits/remotes or public publication.

Final live check used ordinary omarchy theme set dune followed by omarchy theme set
 drokk with wallpapers enabled. Dune retained no megacity shell references or owned
fontconfig override. Drokk returned with no profile conflicts, native gold animation
and normal lock/notification IPC. Final package check: 200 files; 92 local Markdown
links valid. Active theme left as Drokk. Real SDDM login awaits the user step.

### 2026-10-17 — user-confirmed reboot/login and border pulse; documentation

The user reported successful login after reboot and then approved the live gold
border pulse. Recorded both as user-observed target-machine acceptance, separate
from earlier automated checks. These confirmations supersede the pending-login
and pending-pulse statements in the preceding entry. They do not establish a
post-guard lock/unlock, privileged greeter recovery or another installation.

Updated current README, acceptance, compatibility, authentication, companion,
package and testing guides and the existing phase context. The user is unsure
another installation is practical; no target was arranged. Other-machine support
remains unverified and can be stated as a limitation of an early source release.
The real public installation route remains a separate packaging gap.

Read the current upstream Omarchy theme registry and GitHub attachment guidance.
Added a proposed desktop preview, lock/login stills and short demo sequence to
docs/screenshots/README.md. No new capture, desktop change, installation,
authentication action, commit or publication was performed in this follow-up.

Documentation verification: 98 local Markdown file links resolve; a targeted
search found no stale pending-login or pending-pulse claims in the current guides
or active context. Historical log entries remain unchanged. Reviewed the updated
status and media plan; no production tests were rerun for these document-only edits.

### 2026-10-17 — attached window-card omission identified

The user identified the missing per-window overlay card. Inspected the original
approved placement image, current family window-appearance specimen, shared
card renderer and areas 04/22 of the specification. The navy/red-outline card
with gold heading and protruding tuck tab exists only in design output.
Corrected current acceptance/live status to treat it as required unfinished work,
not an accepted limitation. Earlier claims that remaining work was chiefly release
preparation were incomplete. Updated the existing phase-04 context with ownership,
geometry and outstanding runtime/data requirements. No card implementation, live
activation or functional acceptance is claimed by this documentation correction.

### 2026-10-17 — attached window card implemented and activated; remaining limits

Phase 04 in progress. The user authorised implementation, confirmed behavioural
tests for owner attachment/tuck/input and theme cleanup, and explicitly authorised
a finite isolated compositor with disposable windows. Work stayed synchronous in
this session; no agents, scheduled work or resident QA processes were created.

Added a native Hyprland window decoration, Cairo/Pango rendering of the approved
card geometry, and a small geometry/toggle state. Shared resolved `panel.*` colours
and Nimbus font roles feed its separate build. The ordinary 200-file package and
eight Quickshell companions stay separate. The native compiler is installed GCC
16.1.1, matching Hyprland 0.56.1; Node is Mise 26.7.0. The plugin checks the complete
Hyprland API/ABI hash before accessing compositor objects.

Native window ownership supplies stacking, movement, workspace visibility and
closure. Fullscreen and very small windows hide cards. Body clicks pass through;
the exposed gold tab toggles. Actual content is window title, workspace and active
state. Application-specific path/branch/count adapters and the original proposed
160ms slide are not implemented; open/tuck currently changes immediately. These
are explicit remaining scope in the card guide and area 04/22 acceptance rows.

RED/GREEN: geometry test first failed on missing CardState header, then passed;
session registration test failed on missing export, then passed; install/remove
fixture failed on missing module, then passed. An edited-owned-block test exposed
duplicate registration and passed after refusal was added. Review removed unused
press/release state and corrected early release cancellation that would bypass
native held-button bookkeeping.

Native fixture setup failures were not product passes: unsupported standalone
`--socket`, insufficient screenshot buffer, outer-window resize clipping, dummy
QML counter referencing its content parent, and an occlusion region containing the
covering window's own card. Corrected the fixture to use an isolated headless
output, explicit QML window ID, real pointer/readiness control and independent
card regions. Final `mise run theme:check-card` passed real active/inactive cards,
workspace departure/return, ordinary/body input, tuck/reopen, move/resize, stacking,
fullscreen, hidden grouped-window unload, config unload/reload and window closure.
Inspected `harness/evidence/window-card/isolated-open.png`; earlier open/tucked
artwork previews remain alongside it. Only the main compositor instance remained
after cleanup. No host input or authentication was exercised by this fixture.

Final observed checks: `mise exec -- node scripts/build-window-card.mjs` succeeded;
focused serial session/card/install tests 14 passed; `mise run theme:test` 45 passed;
`mise run theme:check` passed 200 ordinary package files; 99 checked local Markdown
links resolve. AI-slop review: `harness/code_review/window-card-review.md`.

Applied `mise exec -- node scripts/window-card.mjs install --live` while unlocked.
Native plugin list reports drokk-window-card; all four existing live windows have
the decoration; `hyprctl configerrors` is empty. Installed binary matches the final
build SHA256 e50e20257ef678ea792982e3fff494f2b4ec7e95fa20d2d8542cb802f5e43f6c.
Implementation fingerprint over the new card sources, build/install/check tools,
related tests, session profile and Mise file:
da831a01c7e57548feb9bd1e8f5c6b0836e23cbc761108997bc4c81b57fc4d43.
Git remains unborn main with preserved untracked work; no commits or publication.

The real normal Omarchy Dune → Drokk switch awaits the user's separate approval:
its stock command starts parallel app updates and background cache warming, which
the project instructions require authorising. The session fixture and native
config unload/reload pass; do not label that as the complete live theme-hook check.
Current desktop is left on Drokk with the card active and no profile conflicts.
Other-host compatibility and user visual acceptance of the live card remain open.

### 2026-10-17 — card edge input, shortcut, animation and live-switch corrections

Phase 04 remains in progress. The user authorised the normal Dune → Drokk check,
then reported that the rightmost tab did not work and requested an active-window
keyboard toggle. Existing authority covered the finite isolated compositor and
card/input/theme-cleanup seams. No agents or additional resident QA process were
created. Omarchy, TDD, ai-slop and crash-diagnosis guidance were read and applied.

The earlier animation build failed on an ambiguous Vector2D constructor; explicit
double arguments corrected compilation. A new native rightmost tiled-window
check reproduced the tab failure. Hyprland's tiled hit testing uses the layout
area, so the existing unreserved tab lay outside it. Reserving a 10px right strip
fixed actual input at 1× and at 2× with zero outer gap. The 160ms eased slide also
passed, with instant changes when native animations are disabled. A single toggle
path now serves tab and Super+Shift+I. The first virtual-keyboard test had a keymap
mismatch; resolving the isolated virtual keyboard by its symbols corrected the
fixture. Actual shortcut input then toggled only the focused card. User keyboard
settings were not changed. No-focus, workspace, owner movement/resize, stacking,
fullscreen and hidden-group cleanup remain covered.

The first live activation claim in this follow-up was incorrect: although disk
bytes matched, the compositor retained the first library mapping after removal.
The user reported a Lua error because that old implementation lacked the callback.
The isolated unmapping assertion reproduced this failure. GCC unique symbols had
prevented real library unloading. Added -fno-gnu-unique and SHA256-named installed
binaries; require removing a previous build before installing another. The old
initial mapping remains inactive until this compositor exits; no reboot was
requested. The corrected binary was verified mapped live, its Lua callback was
invoked successfully, and it survived reload and subsequent theme return. The
new library mapping was absent during Dune. This supersedes acceptance based only
on the original plugin name or on-disk checksum.

The initial normal theme cycle also crashed Quickshell during IPC handler
registration amid local plugin reloads. The shell restarted and its native
services responded. Crash evidence identified the registration path and ample
available memory, not a proven exact upstream lifetime defect. The profile was
publishing watched QML while the shell was still running. The session adapter now
stops the unlocked shell before changed shell/plugin files are written, then uses
the existing stock restart after commit or rollback. A RED fixture demonstrated
that stop failure previously did not prevent writes; it now does. Other fixtures
check restart after completed changes/restoration and no restart for unchanged
shell files. Existing authentication policy and packaged Omarchy files were not
modified. The installed runtime diff contained only these reviewed changes.

Final observed commands/results: mise run theme:build-card succeeded;
mise run theme:check-card passed including real keyboard input, edge input,
animation and library unmapping; mise run theme:test passed all 47 cases;
mise run theme:check passed 200 ordinary package files; 165 local Markdown links
resolve. Inspected the controlled 2× edge screenshot at
harness/evidence/window-card/isolated-edge-2x.png. Native fixture output warnings
are from its temporary compositor setup, not the live desktop. Only the main
compositor remained after fixture cleanup. Review updated in
harness/code_review/window-card-review.md.

Repeated the authorised OMARCHY_THEME_SKIP_BACKGROUND=1 normal Dune → Drokk cycle
after the runtime correction. Dune had no card plugin or shortcut, no mapped new
card library and an inactive profile without conflicts. Drokk restored cards on
all four then-existing windows and exactly one Super+Shift+I binding. Native Lua
callback checks and two toggle invocations returned ok; config errors were empty.
Notification ping and unlocked lock status responded. No new Quickshell crash
report appeared during the corrected cycle. The selected wallpaper SHA256 stayed
unchanged; its link now points at the same artwork under the stable installed
theme directory, since the prior current-theme path disappears on a Dune switch.
This is one successful bounded regression cycle, not universal Quickshell safety.

Final native binary SHA256:
0034344a86a0294dc5a40a6b5ce4c6960a9e546127a6ccfe5d7d6cbb327a9bae.
Implementation fingerprint over card sources, build/install/check tools, session
profile/runtime, relevant tests/pointer fixture and Mise configuration:
ebe20472d97da8154f66981877f98a6da7a77d24b36d83d5a05d33bdbadc1427.
Git remains unborn main with preserved untracked work. No commit or publication.
Application-specific card metadata, other-host and mixed-monitor compatibility
remain unimplemented/unverified as documented. The final desktop is Drokk.

### 2026-10-17 — move the card shortcut away from Omarchy input switching

Phase 04 remains in progress. User authorised a replacement for Super+Shift+I.
Installed bindings had no pre-existing use of that chord, but upstream Omarchy
quattro at 5fcdaca6495cac8931e0624c88414c95e0247585 assigns it to previous input
language. Inspected all 67 Lua/conf files under upstream default/hypr and
config/hypr, plus installed/current bindings: Super+Alt+I was available. Initial
remote discovery tried a nonexistent master branch (404); repository metadata
identified quattro as the default, and that complete read succeeded.

Changed only the owned binding, install conflict guard, native keyboard fixture
and corresponding docs. Used the existing removal command before changing the
owned fragment, then reinstalled with the new registration; no migration layer
or native binary rebuild was necessary. Ordinary input bindings were untouched.
The fixture retains a separate Super+Shift+I action to verify it remains usable.

Observed RED: mise run theme:check-card failed at the new Super+Alt+I registration
assertion with the old source. GREEN: the same finite authorised check passed
actual keyboard input for both chords, active-window isolation, edge input,
move/resize, animation, unload/reload and cleanup. Focused command
mise exec -- node --test --test-concurrency=1 tests/window-card-install.test.mjs tests/theme-session.test.mjs
passed 15 tests. The full suite and another live Dune cycle were not repeated for
this binding-only correction. AI-slop review updated synchronously.

Live remove/install commands succeeded. Profile and looknfeel match the new owned
fragment; exactly one card binding has modifier mask 72 (Super+Alt), key I. The
old card binding is absent. Two live callback invocations returned ok and native
config errors remain empty. Only the main compositor remains after fixture cleanup.
No packaged files, native artwork or unrelated bindings changed; no commit/push.
Focused implementation/test fingerprint (sorted filenames, NUL, file bytes):
fde384d8f8cc7eef4f1768c97e913710211a46b8fb352a126375313e01655f3e.

### 2026-10-17 — latest manual lock confirmation and card portability clarification

The user reconfirmed successful real lock/unlock after the service-guard changes.
Updated acceptance, live status, authentication/companion documentation and Phase
05 context to close that local manual check. This is user-observed evidence;
no credentials were requested or recorded and no lock was triggered by the agent.
Suspend, fingerprint, broader output coverage and recovery remain unverified.

Read the card builder, native initialization and receipt: it requires Hyprland
0.56.1 headers, a matching native compiler and the runtime API/ABI hash. There is
no physical-machine identity restriction. Clarified the card guide: the present
ARM64 binary is architecture-specific; another supported setup needs a compatible
build. Automatic public build/update packaging and other-architecture acceptance
remain unfinished. Official Hyprland plugin usage/development documentation was
checked; it describes matching headers and recommends hyprpm. No plugin-manager
integration, code change, desktop change or wider compatibility claim was made.

### 2026-10-17 — hyprpm source packaging and managed card lifecycle

Phase 04 remains in progress. User authorised hyprpm packaging and separately
approved the real manager's finite isolated lifecycle check. Omarchy, TDD and
ai-slop guidance were applied synchronously; no agents or scheduled work.

Generated dist/drokk-window-card-source contains ten regular source/licence/config
files, a shared-model-derived paint header and hyprpm manifest. It contains no
host binary or developer HOME path. Local and manager builds now use the same
Bash command. It needs native dependencies but no Node/Mise runtime. The initial
accepted header commit is Hyprland 5c9377c15f85c50648f35ca5a213754f95b93ca0
(0.56.1); compiler and runtime API/ABI checks remain. Other architectures and
releases are not newly accepted by this work. Real release commit pins await
committed/published source; no project commit, remote or push was created.

RED: loading the original library through the manager-like native path displayed
cards outside Drokk. GREEN: native enabled=false default plus the existing
profile's enabled setting removes all decorations/input reservations and the
shortcut on departure, even while the library remains loaded. Visible and hidden
grouped-window cleanup passed. The direct local path still supports true unload.
A second RED showed version-only build checks accepted an unknown header commit
with the same version number; exact header-commit preflight now rejects it. Failed
builds remove stale output before checks because the inspected hyprpm treats
output existence as build evidence.

Added managed registration using the existing exact-fragment profile, without
copying or deleting manager binaries. Its first fixture failed because the new
public operation did not exist, then passed install/reselection/theme departure/
return/removal. Updated an existing edit-refusal fixture: its old string
replacement no longer made a change after the Lua loader expression changed.
It now asserts that a real owned-fragment edit was made before testing refusal.

The first manager fixture stopped during sandbox setup: a read-only root could
not create its mount target. An explicit disposable root with read-only system
directories fixed the fixture. A separate temporary-helper template syntax error
was caught by node --check and corrected before manager execution. No failed run
was counted as a pass.

Final mise run theme:check-card-hyprpm passed actual card pointer/keyboard, edge
1x/2x, slide, owner attachment, stacking, fullscreen, hidden-group cleanup and
unload/reload checks. The real manager parsed the generated manifest, selected
real temporary Git commit pins, compiled/installed, selected an updated revision
and rebuilt, rejected an unsupported update without a stale binary, then removed
the package. A matching installed SDK was reused. Namespace-root confined its
privileged file operations to disposable mounts; no host credentials or real
hyprpm cache were used. Fresh SDK/dependency provisioning and host-root ownership
are not established. The source fixture commits were temporary and removed.

Final mise run theme:test passed 49 tests; mise run theme:check passed 200 payload
files; 167 local Markdown links resolve. AI-slop review updated in
harness/code_review/window-card-review.md; all 21 checks assessed within scope.
No separate poller, application data adapter or second theme model was introduced.

Applied the new local build after verification, using the preserved old remover
to remove the exact prior profile fragment before adding its new enabled setting.
An actual OMARCHY_THEME_SKIP_BACKGROUND=1 Dune -> Drokk cycle passed: Dune had
no card or shortcut and inactive profile; Drokk restored the enabled card on all
4 then-existing windows with one Super+Alt+I binding. Config errors were empty;
wallpaper SHA256 was unchanged. This desktop remains on the direct local build;
the real hyprpm cache was intentionally not adopted during this isolated check.
The separate public theme/profile install route, release URL/pins, x86_64 desktop
acceptance and application-specific card metadata remain outstanding.

Native binary SHA256: af92843ce1cd91ee6ca3d7c4396cf36591a114a53834a8786cd6ccb57561ca2a.
Implementation fingerprint (sorted filenames, NUL, bytes; native sources, build/
install/check/profile tools, related tests and Mise configuration):
32fe6a47e5f336087eb3112228c8ab337945ad60b2010dd0a32396945e5f7928.

### 2026-10-17 — narrower root menu and fresh public source repository

Phase 04 menu presentation: user requested a narrower Super+Space root menu while
keeping Super+Alt+Space Apps unchanged. Changed the existing menu presentation
adapter only: root 300px, Apps/ordinary submenus 360px, existing special routes
520px. mise run theme:build succeeded with 200 files; the focused shared compact
menu check passed. Applied the single changed QML binding after an unlocked guard
and stopping the shell before the watched file write. The first immediate menu
ping returned unknown during startup; subsequent summon/ping returned ok. Native
rendered border measurements on the 2x display confirmed root 300px and Apps
360px. Scoped screenshots in ignored harness/evidence/menu-width were inspected.
No route, search or application-library behaviour changed.

Phase 08 source publication: user explicitly authorised a fresh public repository
SurreptitiousFabric/Drokk with no prior Git history. The local branch was unborn
main with no commits or remote. gh authenticated as the requested owner; the
repository did not exist. Created the new PUBLIC repository and configured origin
at https://github.com/SurreptitiousFabric/Drokk.git. Remote inspection confirmed
it was empty before the initial snapshot. Preparing one root commit of the current
source, curated artwork, docs and tests; generated concepts, dist output, local QA
captures and caches remain ignored and preserved locally. The snapshot scan found
no known secret patterns, symlinks or oversized files. Original licences and
third-party notices are retained.

Shortened README at the user's request; detailed guidance remains in linked docs.
mise run theme:check passed 200 files; local Markdown links resolve. The public
repository contains development source, with the pending standalone installation
layout and wider compatibility clearly stated. Public source publication does not
complete the installable-release or broader architecture acceptance work.
