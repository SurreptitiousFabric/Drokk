# Phase 07: Full isolated acceptance and package recovery

## Sources

[Goals](../../GOALS.md), [phase index](../../PLANS.md), [workflow](../../PROMPTS.md),
[user design inputs](../../output/mega-city-one-system-v3/areas.json) and preceding phase evidence.

## Objective, scope and non-goals

Run the entire 24-area acceptance matrix on a clean isolated Omarchy install at the supported baseline. Test fresh install, reapply/update, switch-away/back, removal, rollback after injected failure and reinstall. Inspect the actual rendered review artifacts, including every changed PDF page. Record source hashes and environment versions. Review implementation for AI slop and ownership violations.

Excluded: No claim of target hardware acceptance from VM results and no public publishing. Do not reuse stale design verification receipts as runtime evidence.

## Dependencies, owners and decisions

Dependencies: 06.

Single acceptance matrix in docs/mega-city-one-spec.md; dated evidence manifests under harness/evidence/ (ignored local captures); concise results in phase review/log. Release manifests identify source fingerprints.

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

Run the final production build/check/test tasks serially on a stable tree; exact commands are established in Phase 02. Run clean-install and recovery exercises in disposable snapshot/fixture. For each acceptance row record environment, operation, assertion/visual evidence, result and fingerprint. Retain failed receipts; relevant source changes invalidate affected results.

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

All 24 areas have observed operation/state results and source-linked screenshots; no unexplained failures or silent gaps. Palette/eagle replacement propagates through every consumer. Required normal/error/disabled states and multi-scale checks pass. Install/removal restores baseline; release builds without ignored output/. Unavailable hardware checks remain explicitly pending Phase 08, not waived.

Map each required operation to actual evidence and the tested tree. Missing,
failed or unavailable evidence prevents completion unless the user explicitly
accepts a specific limitation. Distinguish programmatic validation, visual
inspection, real authentication/session operations and host observations.

## Handoff

Update this phase's material context, review findings and project log. Complete
only after the acceptance checks and recovery requirements are satisfied; pass
remaining work/decisions to the dependent phase without inventing results.
