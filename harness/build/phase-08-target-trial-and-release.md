# Phase 08: Target-machine trial and working release

## Sources

[Goals](../../GOALS.md), [phase index](../../PLANS.md), [workflow](../../PROMPTS.md),
[user design inputs](../../output/mega-city-one-system-v3/areas.json) and preceding phase evidence.

## Objective, scope and non-goals

Prepare a concrete installation diff, backed-up current config and tested restore command. Review current user authorisation before activation; if live changes lack authorisation, request approval only after the package and rollback are reviewable. Install into user-owned locations, test actual GPU/displays/scaling/fonts/status devices and daily workflow. Test lock/login only after preserving work and confirming recovery. Produce a self-contained release package and concise install/update/remove guide.

Excluded: No unscheduled reboot/logout, loss of unsaved work, remote publishing or credential/policy changes. Do not infer live activation authority from this planning request.

## Dependencies, owners and decisions

Dependencies: 07.

Package/installer ownership receipts govern changed files; user-owned config stays authoritative outside owned changes. Goal completion and release evidence belong to project log, not mockup manifests.

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

Run package gates on final source tree plus actual native target interactions and configuration-error checks. Record final hashes/versions, changed paths and restore receipt. Host SDDM/session tests need a scheduled user-attended window; keep work pending until real evidence exists. A successful install command is insufficient.

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

User can use the actual themed desktop, terminal/files, launcher, notifications, lock and login on the target machine. All 24 requirements pass or have explicit user-accepted deviations. Verify real hardware state transitions, multi-monitor/scaling and suspend/resume. Restore the previous configuration successfully, then reapply the theme. Final package is reproducible and no unresolved security/recovery failure remains.

Map each required operation to actual evidence and the tested tree. Missing,
failed or unavailable evidence prevents completion unless the user explicitly
accepts a specific limitation. Distinguish programmatic validation, visual
inspection, real authentication/session operations and host observations.

## Handoff

Update this phase's material context, review findings and project log. Complete
only after the acceptance checks and recovery requirements are satisfied; pass
remaining work/decisions to the dependent phase without inventing results.
