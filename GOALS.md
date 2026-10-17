# Goal: a working Mega-City One theme

## Outcome and completion

Deliver a reproducible, versioned Mega-City One Omarchy package and any explicitly
identified user-owned extensions, with reversible installation. All 24 design
areas must have a traced implementation, functional/visual acceptance evidence,
or a specific user-accepted limitation. A silent omission is not completion.
The target-machine desktop, lock and login must work; VM screenshots alone do
not establish final completion. Test switching away/back and complete restoration.

## Design invariants

Preserve the approved dark navy/cream/gold design: background #0E1822,
foreground #E8EEF4, accent #D1B472 as starting values, subject to the full source
palette. Keep Share Tech mono/display, IBM Plex Sans interface and the established
icon font roles. Confirm installed font resolution rather than trusting a label.
Terminal transparency starts at .92; launcher/notifications .94; file manager
solid; 8px backdrop blur is the design target, verified against real support.
Text/icons/borders remain opaque. Enabled bar indicators gold; idle cream;
unavailable muted; attention red. Verify real state changes, not hardcoded samples.

Retain the classic eagle identity and the approved lock/login artistic language:
flat lock emblem, monumental embossed login art. Reconcile the richer original
raster eagle with the editable master explicitly; do not silently substitute a
simpler drawing. Clock, date, username, password and controls must be native/live,
not artwork pixels. Any necessary difference from the concept needs visible
comparison and a recorded decision, never a convenience-driven simplification.

## Shared ownership

One tracked colour/typography/effects/asset model feeds production configuration
and previews. Omarchy's installed schema determines native support; a design token
is not proof of a supported setting. Generated files have no independent edits.
Palette changes propagate to consumers. Raster illustration pixels are an explicit
exception: use colour-independent artwork/masks where possible; otherwise document
regeneration requirements, never claim automatic raster recolouring.

## Scope and exclusions

Mega-City One only. Brit-Cit, Sov, Anderson, Hershey, Death and Mean Machine are
preserved design work, outside this implementation. Desktop wallpaper redesign is
deferred; use a selected existing background as test context and package baseline.
Do not change authentication policy, credentials, services unrelated to theming,
or packaged Omarchy source. No public release, Git remote, commits/pushes,
delegation or background execution is implied by this plan.

## Baseline and authority

The user's conversation establishes this outcome and the 24-area requirement.
[The plan](PLANS.md) sequences delivery. Existing sources are listed in
[Phase 01](harness/build/phase-01-specification-and-baseline.md).
The host reported Omarchy 4.0.0.r6589.gdec29fa-1 during read-only inspection;
SDDM is the configured display manager. Recheck at implementation time and record
compatibility by version/commit. Do not automatically upgrade the host to fit code.

## User decision: standard theme and live comparison first

The user clarified that this must be an Omarchy theme rather than bespoke replacements. Use supported stock theme/configuration mechanisms first. Preserve all 24 design areas as comparison targets, but label unsupported exact geometry/behaviour as stock differences for review, not mandatory custom-component work. Companion extensions require a later decision. The user authorised live adjustment/comparison and explicitly approved the standard switcher background helpers. This supersedes the earlier isolated-first activation gate for this bounded live trial. Later explicit authorisation covered bounded companions and separate greeter
installation. Current scope and remaining acceptance are in docs/live-feature-status.md;
authentication/session policy changes remain excluded.
