# Window-card review — 2026-10-17

Scope: the native card renderer/state/decoration, optional build and install tools,
one additional session-profile fragment, and focused fixtures/native checks.
Applied all 21 ai-slop checks synchronously. No delegation or packaged-source edits.

## hyprpm follow-up review

Reviewed the generated source-package boundary, single shared native build command,
version guard, managed registration, native enabled setting and isolated manager
fixture against all 21 checks. Resolved the following issues in this follow-up:

- P1, lifecycle ownership (checks 10, 14, 15, 20): a manager-loaded plugin initially
  displayed cards outside Drokk. The native enabled value now defaults false;
  the profile enables it, and config reload removes decorations/input reservations
  from every window when it is false. Real native checks include hidden grouped
  windows and shortcut removal while a manager library remains loaded.
- P2, version acceptance (checks 5, 14, 15): checking only `0.56.1` accepted a
  different commit reporting that version. A compiler preflight now checks the
  accepted header commit; the existing ABI check still guards loading. A failing
  build deletes stale output because hyprpm uses output existence as build evidence.
- P2, build duplication (checks 1, 11, 20): the local builder and manager now use
  the same Bash build entry point. The source package's paint header is generated
  from the existing theme model; no second palette or compiler implementation.
- P2, fixture sensitivity (checks 13, 14): the old edited-block fixture's text
  replacement stopped making a change after the Lua load expression changed.
  It now makes and asserts a real edit to the owned fragment before testing refusal.

The manager fixture uses the real binary, manifest parser, Git pin selection,
compiler and cache/update/removal logic inside disposable namespaces. Namespace
root confines its privileged file commands to the fixture. The matching installed
SDK is reused; fresh header/dependency provisioning and real host root ownership
are outside this test. No production privilege helper was added.

Generated release pins are intentionally empty until real compatible source
commits exist. The explicit build guard still rejects every unaccepted commit.
The fixture creates only temporary local Git history to exercise real pins; the
project's unborn branch remains untouched. Publication and x86_64 desktop checks
remain separate. No further actionable finding in this bounded review.

## Findings resolved

- P2, stock shortcut conflict (checks 5, 14, 20): Super+Shift+I was free on this
  host but upstream Omarchy assigns it to the previous input language. Changed
  the profile and installer guard to Super+Alt+I after checking both binding
  sources. Native input checks exercise the new chord and an independent
  Super+Shift+I fixture action. No extra shortcut manager or compatibility layer
  was added. All 21 checks were reapplied to this bounded correction; no further
  actionable finding.
- P1, input ownership (checks 10, 14, 15): cancelling release in the early global
  pointer callback bypassed Hyprland's held-button bookkeeping. The listener now
  observes ownership only; native input bookkeeping runs before the decoration
  consumes a release. The body and normal application areas receive real clicks
  in the isolated test; repeated tab press/release works.
- P2, configuration ownership (checks 15, 20): first installer code would append a
  second block after a user edited the owned block. A failing install fixture
  reproduced this. Installation now rejects the edited block, preserving its bytes.
- P2, redundant state (checks 3, 6, 12): the geometry class duplicated press/release
  state that the native input boundary already owns. It now only toggles at an
  accepted tab point; real release behaviour is exercised through Wayland input.
- P2, verification quality (checks 13, 14): the initial nested display could resize
  with its outer window, the dummy QML click handler targeted its content item,
  and the first occlusion region included the covering window's own card. Fixed
  fixtures use a fixed isolated headless output, a window ID, an ordinary-body
  input control and non-overlapping card regions. No failed run counted as a pass.
- P1, native update identity (checks 8, 14, 15, 20): GCC unique symbols kept the
  first library mapped after plugin removal. Replacing its file and reloading the
  same path reused old code, so the live shortcut referenced a missing Lua action.
  An actual unmapping assertion failed before `-fno-gnu-unique` and passed after
  it. Installed filenames include the validated binary hash; updates require
  removal first. Native reload and live callback checks now exercise the running
  implementation, rather than accepting an on-disk hash as deployment proof.
- P2, tiled input (checks 14, 15): unreserved decoration extents were outside the
  rightmost tiled window's layout hit area. A real pointer regression reproduced
  the user's failure. Reserving 10px through the native decoration layout fixes
  it, including a 2× output with zero outer gap. No global pointer hook was added.
- P1, shell replacement ordering (checks 10, 15, 20): the existing profile changed
  watched QML before restarting Quickshell. The live switch crashed during IPC
  registration amid plugin reloads. The session adapter now stops the unlocked
  shell before changed shell/plugin files are published and restarts after commit
  or rollback. Fixtures cover stop refusal, completed writes, rollback and no-op
  selection. The subsequent real Dune/Drokk cycle produced no new crash report.
  This mitigates the observed switching path; the upstream IPC defect itself has
  not been independently reproduced or fixed.

## Boundaries and remaining limits

The implementation reuses native decoration ownership, the existing session
profile and resolved palette/fonts. No polling daemon, global overlay, function
hook, alternate theme manager or application metadata parser was introduced.
Native rendering is necessary for the required window attachment/stacking; it
adds exact Hyprland/compiler compatibility requirements outside ordinary theming.

Application-specific metadata remains unfinished and is stated explicitly.
The 160ms slide uses the installed Hyprutils easing curve and compositor damage
scheduling, with instant changes when animations are disabled. One toggle method
serves tab and keyboard input. The Lua callback is plugin-owned; its binding is
profile-owned and disappears on theme departure. The geometry helper no longer
contains a second, unused toggle implementation.
Only the exposed 9px of the 12px tab receives decoration input; the approved
renderer overlaps the tab with the window by 3px. Other-host compatibility and
arbitrary third-party decoration combinations are not established.

All remaining checklist categories were checked without an actionable finding
within this scope; this is not a security certification or repository-wide review.
The build log owns final command outcomes and target-machine evidence.
