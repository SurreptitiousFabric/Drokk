# Phase 01: Specification, assets and test baseline

## Sources

[Goals](../../GOALS.md), [phase index](../../PLANS.md), [workflow](../../PROMPTS.md),
[user design inputs](../../output/mega-city-one-system-v3/areas.json) and preceding phase evidence.

## Objective, scope and non-goals

Audit all 24 areas against the installed Omarchy templates/plugins and approved designs. Promote the minimal curated model, assets, font licences and reference images from ignored output/ into tracked theme/mega-city-one/source/ and docs/reference/. Fingerprint promoted inputs; document copyright/licensing and exact versions. Pin required supported tools locally through Mise. Inventory current user config without secrets; identify a restorable baseline. Inspect VM availability/architecture and select a matching isolated Omarchy environment; document exact creation/launch commands before running them.

Excluded: No theme activation, package installation, wallpaper redesign, other variants or changes to Proof. Do not claim that raster lock/login images are editable assets.

## Dependencies, owners and decisions

Dependencies: None.

Source model/ref snapshots: tracked theme/mega-city-one/source/; 24-area implementation and acceptance contract: docs/mega-city-one-spec.md; installed-source/version observations: this phase context.

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

Document/source audit: RED/GREEN runtime tests are not applicable. Check completeness, source traceability, links and explicit unresolved decisions.

## Verification

Read-only starting commands: omarchy version; git status --short; mise current node; mise exec -- which node. Inspect /usr/share/omarchy/default/themed/ and installed shell/SDDM sources. Check document links, all 24 IDs and source fingerprints. VM capability/launch and additional tool pins are discovery outputs, not established commands.

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

Document every area as native, user extension, app config or explicit gap, with file/owner, states, checks and priority. Select supported Omarchy baseline and test environment; state unavailable capabilities without downgrading acceptance. Resolve exact eagle/reference layering and separate live UI from images. All required release inputs must be tracked with licences/provenance and no dependence on output/. Recovery plan identifies scope, files and baseline before later writes.

Map each required operation to actual evidence and the tested tree. Missing,
failed or unavailable evidence prevents completion unless the user explicitly
accepts a specific limitation. Distinguish programmatic validation, visual
inspection, real authentication/session operations and host observations.

## Handoff

Update this phase's material context, review findings and project log. Complete
only after the acceptance checks and recovery requirements are satisfied; pass
remaining work/decisions to the dependent phase without inventing results.
