# Mega-City One delivery plan

## Authority and current boundary

Implementation and a bounded live installation have been authorised and carried
out. This is the delivery plan, not a claim of completed acceptance. The current
state is in [live status](docs/live-feature-status.md); observed execution remains
in [the build log](harness/build-log.md). The user has now authorised real-login and final lifecycle/24-area acceptance.
Observed desktop lifecycle results and remaining gaps are in docs/acceptance.md. Public
publishing, Git commits/remotes and independent environment provisioning have
not been authorised by this documentation cleanup.

## Sequence

| Phase | Plan | Depends on | Delivery checkpoint |
|---|---|---|---|
| 01 | [Specification, assets and test baseline](harness/build/phase-01-specification-and-baseline.md) | None | All 24 requirements mapped; curated sources and test baseline |
| 02 | [Shared build, package and reversible installer](harness/build/phase-02-shared-build-and-package.md) | 01 | Deterministic package and fixture-proven rollback |
| 03 | [Native desktop and application theme](harness/build/phase-03-native-desktop.md) | 02 | Real terminal/files/native apps on test desktop |
| 04 | [Bar, launcher, notifications and effects](harness/build/phase-04-shell-components.md) | 03 | Real shell states, launcher and notifications |
| 05 | [Working lock screen](harness/build/phase-05-lock-screen.md) | 04 | Working isolated lock and recovery |
| 06 | [Working SDDM login](harness/build/phase-06-login-screen.md) | 05 | Working isolated SDDM login and recovery |
| 07 | [Full isolated acceptance and package recovery](harness/build/phase-07-isolated-acceptance.md) | 06 | Full matrix and clean-install acceptance |
| 08 | [Target-machine trial and working release](harness/build/phase-08-target-trial-and-release.md) | 07 | Actual target-machine acceptance and release |

## Completion rules

No phase is complete from screenshots, build success or plan validation alone.
The goal remains open through real target-machine acceptance. The 24-area map
below is coverage intent, not completed evidence. Phase 01 expands each to all
required operations, target files, supported versions and checks in one spec.

## Coverage of all 24 areas

| Area | Name | Implementation phase | Final evidence |
|---|---|---|---|
| 1 | Wallpaper | 03 | Native acceptance in 07; target checks in 08 |
| 2 | Colour palette | 03 (model in 02) | Native acceptance in 07; target checks in 08 |
| 3 | Window borders | 03 | Native acceptance in 07; target checks in 08 |
| 4 | Window appearance | 03 | Native acceptance in 07; target checks in 08 |
| 5 | Terminal | 03 | Native acceptance in 07; target checks in 08 |
| 6 | Terminal font | 03 | Native acceptance in 07; target checks in 08 |
| 7 | Application launcher | 04 | Native acceptance in 07; target checks in 08 |
| 8 | Omarchy Shell bar | 04 | Native acceptance in 07; target checks in 08 |
| 9 | Notifications | 04 | Native acceptance in 07; target checks in 08 |
| 10 | Lock screen | 05 | Native acceptance in 07; target checks in 08 |
| 11 | GTK applications | 03 | Native acceptance in 07; target checks in 08 |
| 12 | Qt applications | 03 | Native acceptance in 07; target checks in 08 |
| 13 | Icons | 03 | Native acceptance in 07; target checks in 08 |
| 14 | Mouse cursor | 03 | Native acceptance in 07; target checks in 08 |
| 15 | Neovim | 03 | Native acceptance in 07; target checks in 08 |
| 16 | File managers | 03 | Native acceptance in 07; target checks in 08 |
| 17 | System monitor | 03 | Native acceptance in 07; target checks in 08 |
| 18 | Browser | 03 | Native acceptance in 07; target checks in 08 |
| 19 | Fonts | 03 | Native acceptance in 07; target checks in 08 |
| 20 | Background effects | 03 | Native acceptance in 07; target checks in 08 |
| 21 | Workspace indicators | 04 | Native acceptance in 07; target checks in 08 |
| 22 | Screen transitions | 04 | Native acceptance in 07; target checks in 08 |
| 23 | Selection highlights | 03 | Native acceptance in 07; target checks in 08 |
| 24 | Login screen | 06 | Native acceptance in 07; target checks in 08 |

Wallpaper uses the existing selected asset; new wallpaper art is excluded.
Font metrics/effects, cursor/icons and transitions still require explicit evidence;
none disappear merely because stock theme files do not cover them. Phase 01 must
flag unsupported settings and resolve the delivery approach without lowering scope.

## Repository layout to establish during implementation

- theme/mega-city-one/source/: canonical palette, typography, effects and assets.
- scripts/ and tests/: generator, lifecycle adapters and behavioural checks.
- docs/mega-city-one-spec.md: detailed 24-area contract and evidence mapping.
- docs/reference/: tracked selected references; never runtime-generated UI pixels.
- dist/: disposable standalone package, ignored by Git.
- harness/evidence/: local screenshots/receipts, ignored; log/review retain concise
  results and fingerprints. Curated redistributable acceptance artifacts may be
  deliberately tracked later without exposing personal/session data.

[Phase format](harness/build/README.md) and [workflow](PROMPTS.md) own execution
procedures. No future empty context/review files are created in advance.

## User decision: standard theme and live comparison first

The user clarified that this must be an Omarchy theme rather than bespoke replacements. Use supported stock theme/configuration mechanisms first. Preserve all 24 design areas as comparison targets, but label unsupported exact geometry/behaviour as stock differences for review, not mandatory custom-component work. Companion extensions require a later decision. The user authorised live adjustment/comparison and explicitly approved the standard switcher background helpers. This supersedes the earlier isolated-first activation gate for this bounded live trial. That standard-only trial was later extended by explicit user authorisation;
current component scope is recorded in the companion and authentication guides.
Authentication/session policy changes remain excluded.

## Optional companion decision

The user subsequently authorised narrow plugins for necessary remaining appearance
differences, with source review and validation in this session rather than a human
review prerequisite. The initial eagle-only scope was subsequently extended to the bounded companions
listed in [the companion guide](docs/companions.md), plus separate SDDM installation.
The normal theme remains independent; authentication policy changes stay excluded.

## Brit-Cit extension

The user authorised [Phase 09: Brit-Cit](harness/build/phase-09-brit-cit.md)
on 2026-10-18. Work on its separate package before public installation packaging;
retain the live Mega-City One desktop. This supersedes the earlier variant exclusion
for Brit-Cit only. Other variants remain preserved design work.

## Judge Death extension

The user authorised [Phase 10: Judge Death](harness/build/phase-10-judge-death.md)
on 2026-10-18, after applying the accepted Brit-Cit bar settings to Mega-City One.
Use selected option A and shared implementation. Keep Brit-Cit live while preparing
Death; do not infer a greeter selection change from preparation alone.
