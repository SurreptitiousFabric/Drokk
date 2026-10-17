# Phase 03: Native desktop and application theme

## Sources

[Goals](../../GOALS.md), [phase index](../../PLANS.md), [workflow](../../PROMPTS.md),
[user design inputs](../../output/mega-city-one-system-v3/areas.json) and preceding phase evidence.

## Objective, scope and non-goals

Implement native colours, full ANSI palette, active/inactive borders, window appearance, real terminal fonts/effects, supported GTK/Qt apps, file manager, Neovim, btop and browser surfaces. Use existing wallpaper only. Resolve actual font files/glyphs and narrow app-specific adapters. Implement cursor/icons only with supported package/file ownership and documented limitations. Run the desktop slice in the isolated environment.

Excluded: No new wallpapers, authentication components or host-wide default changes. Do not claim arbitrary web pages or every third-party application is themeable.

## Dependencies, owners and decisions

Dependencies: verified Phase 02 package/lifecycle seam for offline adapters. Full Phase 02 completion and isolated runtime remain prerequisites for native desktop acceptance.

Native theme adapters generated from shared model; application runtime is owner of its state. Use area matrix to define supported app/version boundaries.

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

Run Phase 02 build/check and focused adapter tests. Establish exact foreground VM launch/config validation commands from Phase 01 and record them before use. Capture real app screens at target resolution/scaling; exercise focus/selection, long filenames/code, light/dark app modes and missing glyphs. No screenshot-only acceptance for interactive behaviour.

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

Real terminal/files plus active/inactive windows match dark foundation, typography and borders. Terminal .92 does not fade glyphs; files remain solid. Font resolution, ANSI readability and supported app colour states are verified. Other installed themes still work when switched away and back. Palette probe propagates without manual preview edits.

Map each required operation to actual evidence and the tested tree. Missing,
failed or unavailable evidence prevents completion unless the user explicitly
accepts a specific limitation. Distinguish programmatic validation, visual
inspection, real authentication/session operations and host observations.

## Handoff

Update this phase's material context, review findings and project log. Complete
only after the acceptance checks and recovery requirements are satisfied; pass
remaining work/decisions to the dependent phase without inventing results.
