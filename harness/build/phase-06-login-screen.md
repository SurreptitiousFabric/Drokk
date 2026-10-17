# Phase 06: Working SDDM login

## Sources

[Goals](../../GOALS.md), [phase index](../../PLANS.md), [workflow](../../PROMPTS.md),
[user design inputs](../../output/mega-city-one-system-v3/areas.json) and preceding phase evidence.

## Objective, scope and non-goals

Implement a separate SDDM theme around approved monumental eagle artwork. Create live identification heading, user/password fields, sign-in action, session selector and error/focus/loading states. Fonts/assets must be accessible to the greeter account. Package separately and retain the previous greeter configuration.

Excluded: No autologin/PAM/session policy edits, reboot of the working host or assumption that lock styling applies to SDDM. Do not ship the concept's baked-in form fields as background pixels.

## Dependencies, owners and decisions

Dependencies: 05.

Tracked SDDM presentation sources and separate installer adapter; SDDM owns authentication and session launch. Shared model still owns typography/colours/assets.

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

Resolve exact installed SDDM/Qt version, executable and supported --test-mode invocation from local help before documenting/running it. Test mode is visual evidence only. Real VM login/logout and recovery are required separately. Do not restart host SDDM or terminate a session as a preview technique.

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

Greeter test-mode rendering is verified AND actual isolated SDDM login starts the expected Hyprland session. Wrong credentials, keyboard layouts, focus, user/session selection and readability work. Check real greeter asset access. Recover prior greeter after deliberately failing theme load, without changing security policy.

Map each required operation to actual evidence and the tested tree. Missing,
failed or unavailable evidence prevents completion unless the user explicitly
accepts a specific limitation. Distinguish programmatic validation, visual
inspection, real authentication/session operations and host observations.

## Handoff

Update this phase's material context, review findings and project log. Complete
only after the acceptance checks and recovery requirements are satisfied; pass
remaining work/decisions to the dependent phase without inventing results.
