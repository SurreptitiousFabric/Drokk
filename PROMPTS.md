# Theme workflow, adapted from Proof

Derived from the locally inspected Proof AGENTS.md, GOALS.md, PLANS.md,
PROMPTS.md and harness/build/README.md. Proof's Rust/GTK/STEMMA rules, test
commands and historical permissions do not carry into this repository.

## Orient and prepare

Read the applicable instructions, goals, phase index, phase plan, its context,
project build log and relevant reviews. Inspect Git status, live source and
installed Omarchy component versions before writes. Identify paths, scope,
acceptance, dependencies and authorisation. Plans do not activate the desktop.
Ask only for a real missing requirement/authority; resolve routine reversible
choices from sources and existing user instructions.

## Consumer discovery

Before changing shared colours, assets, fonts, generated formats or shell contracts,
trace all consumers and record a small operation/owner/check-or-gap table in the
active phase context. Include install, render, switch, restore and removal paths.
Map each to a focused check. For local changes inspect direct consumers only.
Do not create a second palette, independent preview theme or parallel config owner.

## Fixture preflight

For unfamiliar Omarchy/QML/SDDM schemas or authentication fixtures, start with a
working stock example from the pinned installed version. Confirm field meaning
against its parser/component. Establish test prerequisites before claiming RED.
Separate broken test setup from failure of the intended behaviour. Use dummy
credentials in isolated tests and never retain password text or real input traces.

## Implement

Work one bounded phase/slice at a time. Create its context only when it starts.
Use meaningful behavioural RED, minimum GREEN, then bounded refactoring for
production logic; use visual checks for cosmetic styling. Authentication tests
must reach a real isolated authentication seam; a rendered form is not a login.
Keep session security and package-owned code unchanged. Run long checks in the
foreground with finite deadlines and heartbeat-compatible output/yields.
The no-background rule also applies to tools that launch background work internally;
inspect them and obtain current authorisation or use a synchronous alternative.

## Verification selection

Run focused checks while behaviour changes, then serial required final gates after
code/review fixes settle. Record the source commit plus dirty-tree fingerprint
(including new files); before the first commit use hashes. Capture target version,
command, result, evidence path, date and limitations. Rerun when relevant inputs
change and say why. Do not repeatedly run broad checks without a concrete reason.
Keep every failed/skipped/timeout outcome. A timeout is not a pass.

Known design-only baseline checks, run from repository root when relevant:
- mise exec -- node output/mega-city-one-system-v3/verify.mjs
- mise exec -- node output/mega-city-one-system-v3/build.mjs

These check or generate mockups, not installed theme behaviour. Production task
names in plans are proposed interfaces, NOT existing runnable commands. Phase 02
must implement and document them before later plans invoke them. Current Python
is not selected; do not invoke the Python harness validator through a system runtime.
Use document/link checks under the already Mise-selected Node until a local pin
is deliberately introduced.

## Review and completion

Review scope, diff, source ownership, tests and every acceptance operation
synchronously. Use ai-slop for implementation review. Each requested state maps
to an assertion or observed native interaction on the recorded tree. Separate:
configuration validation; automated behaviour; VM visual/native observations;
target-machine acceptance; user decisions; unavailable evidence. Passing counts
or image-loading checks do not prove visual correctness. Render the ACTUAL final
PDF/screenshots and inspect all new/changed pages at useful size. Missing/cropped
art, unreadable text and lost palette propagation are release failures.

## Context and project evidence

Plans own scope and acceptance; PLANS.md owns dependencies and authorisation;
harness/build-log.md alone owns phase execution status. Use Not started,
In progress, Blocked, Complete. Create one material context file per started phase
under harness/context/; record decisions/rationale/provenance and unresolved facts,
not transcripts. Reviews under harness/code_review/ own findings and resolutions.
The project log records material events with phase/status, authorised scope,
changes, observed RED/GREEN/refactor, exact verification/results, review,
operational/rollback evidence, limits, blockers, next action and evidence links.
Append corrections instead of erasing contradictory evidence. No machine log,
credentials, clipboard contents or raw diagnostic dumps.

Complete a phase only when all its acceptance and required checks are satisfied,
findings fixed or user-accepted, and applicable recovery/cleanup demonstrated.
Before stopping, update the existing phase context and log, inspect the entire
changed scope including new files, and report what is complete versus unverified.
Do not mark the product goal complete when only its plan is complete.
