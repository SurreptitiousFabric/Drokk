# Phase 05: Working lock screen

## Sources

[Goals](../../GOALS.md), [phase index](../../PLANS.md), [workflow](../../PROMPTS.md),
[user design inputs](../../output/mega-city-one-system-v3/areas.json) and preceding phase evidence.

## Objective, scope and non-goals

Implement approved centred time/date/emblem/user/input/button layout using existing lock security/session infrastructure. Source flat eagle separately from wallpaper, native live time/date/user and native password controls. Keep errors/loading/focus behaviour. Verify recovery in the isolated test environment before any host activation.

Excluded: No PAM/authentication-policy changes, real password recording or rasterised UI. Do not test first by locking the user's active session.

## Dependencies, owners and decisions

Dependencies: 04.

User-owned lock presentation adapter; Omarchy lock/session/authentication services remain authoritative. Source assets and palette are shared.

Resolve schema/version/asset availability against inspected source. Record material
choices and uncertainty in this phase's context when work begins. No automatic
acceptance of a visual reduction or unsupported behaviour.

## Authorisation

The current user request authorises planning and Git initialisation. This phase
specifies delivery work; consult current session authorisation before execution.
Planning is not approval to activate a theme, provision a VM, install dependencies,
restart services, log out/reboot, commit/push or create background work. Routine
reversible engineering choices inside subsequently authorised scope need no repeat approval.

## RED, GREEN and refactoring

Start with the nearest working stock/fixture example. Add a focused failing behavioural check at the affected public seam; establish fixture prerequisites first. Implement the minimum change, observe GREEN, then refactor without new scope. Cosmetic differences require actual visual comparison rather than implementation-mirroring unit tests. See acceptance below for required native operations.

## Verification

Use installed lock source to establish the supported preview/test seam in phase context. Presentation tests alone cannot prove authentication. Run isolated end-to-end session tests with explicit manual credential entry if required, recording outcomes without inputs. Finite test deadlines and recovery procedure are required before first actual lock.

Use foreground finite checks, serially, with heartbeat-compatible yields. Record
actual commands/results and tree fingerprints, not hypothetical success.

## Operational, security and recovery considerations

Preserve current work, user files, config and references. No packaged Omarchy edits
or credentials in evidence. Prove owned-file restoration before live lifecycle changes.
Test in an isolated environment before touching the host. Unsupported destructive
or privileged actions must stay outside current authority; prepare their concrete
change and recovery material first. Long-running service/VM work cannot bypass
the no-background/no-delegation instructions.

## Acceptance and evidence

Demonstrate correct/wrong credentials using an isolated test account; long password entry, repeated failure, keyboard layouts/Caps Lock, loading and focus, multi-monitor coverage, suspend/resume and unlock. No usable unlocked content/input path through the lock. Flat eagle and all labels follow the agreed centreline at supported scales. A separate recovery route is verified.

Map each required operation to actual evidence and the tested tree. Missing,
failed or unavailable evidence prevents completion unless the user explicitly
accepts a specific limitation. Distinguish programmatic validation, visual
inspection, real authentication/session operations and host observations.

## Handoff

Update this phase's material context, review findings and project log. Complete
only after the acceptance checks and recovery requirements are satisfied; pass
remaining work/decisions to the dependent phase without inventing results.
