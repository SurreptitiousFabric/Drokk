# Phase 02: Shared build, package and reversible installer

## Sources

[Goals](../../GOALS.md), [phase index](../../PLANS.md), [workflow](../../PROMPTS.md),
[user design inputs](../../output/mega-city-one-system-v3/areas.json) and preceding phase evidence.

## Objective, scope and non-goals

Implement a single shared model and renderer that emits a standalone Omarchy theme, preview data and manifest; unsupported keys fail explicitly. Implement staged install, dry-run, backup/restore and removal with ownership receipts. Build a clean temporary HOME fixture covering existing user files, conflicting destination, reapply, failure/rollback and uninstall. Separate optional user-owned extensions and SDDM integration from portable colours.

Excluded: No target-desktop activation or live SDDM changes. Do not copy generated files into multiple independent owners or auto-edit unrelated user files.

## Dependencies, owners and decisions

Dependencies: Phase 01 source promotion and 24-area contract are verified. Offline build/lifecycle work may proceed while Phase 01 environment selection remains open; this does not waive isolated/native acceptance.

theme/mega-city-one/source/ owns tokens/assets; scripts/ owns generator and lifecycle adapters; dist/ is disposable output; mise.toml owns task commands; tests/ owns contract fixtures.

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

Proposed tasks to implement here: mise run theme:build; mise run theme:check; mise run theme:test; mise run theme:install -- --dry-run --target-home <fixture>; mise run theme:remove -- --dry-run --target-home <fixture>. These are not yet available. Establish exact CLI syntax and test runner in mise.toml and amend downstream references before use.

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

Clean build is deterministic, fully self-contained and has a complete hashed manifest. A changed palette token reaches production and preview consumers; alias cycles/invalid colours/unsupported tokens fail. Installer preserves existing files, detects later user edits and restores only owned changes. Failed install and repeated uninstall leave the fixture intact. Generated files are never authoritative inputs.

Map each required operation to actual evidence and the tested tree. Missing,
failed or unavailable evidence prevents completion unless the user explicitly
accepts a specific limitation. Distinguish programmatic validation, visual
inspection, real authentication/session operations and host observations.

## Handoff

Update this phase's material context, review findings and project log. Complete
only after the acceptance checks and recovery requirements are satisfied; pass
remaining work/decisions to the dependent phase without inventing results.
