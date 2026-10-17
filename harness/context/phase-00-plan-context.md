# Planning context

## Decisions and provenance

- User requested a plan based on the harness in /home/swa/src/Proof and defined
  the product goal as a working Mega-City One theme. User separately authorised
  Git in this workspace. These statements authorise the current planning setup;
  no production implementation or host activation occurred here.
- Directly inspected Proof AGENTS.md, GOALS.md, PLANS.md, PROMPTS.md,
  harness/build/README.md and a phase/context example. Adopted single artifact
  ownership, bounded phases, consumer discovery, conditional fixture preflight,
  focused verification and operation-level acceptance. Rust/GTK/STEMMA-specific
  commands/architecture and Proof's historical commits/pushes are excluded.
- git status --short initially reported no Git repository; git init -b main then
  succeeded. Existing output/ is preserved and ignored, with curated build sources
  to be promoted in Phase 01. An ignored file is not a release dependency.
- Host inspection reported Omarchy 4.0.0.r6589.gdec29fa-1, native shell templates
  and /usr/lib/systemd/system/sddm.service as the display-manager target. Lock
  presentation lives in the installed shell lock plugin. Treat these as baseline
  observations, not a guarantee that every mockup is native-themeable.
- Mise currently selects Node 26.7.0 at
  /home/swa/.local/share/mise/installs/node/latest/bin/node; Python has no selection.
  Planning checks use Node. A project-local pin and exact production tasks are
  Phase 01/02 work; no system-runtime fallback.

## Unresolved implementation facts

VM tooling/image availability and architecture, exact supported isolated shell and
SDDM preview commands, greeter account font access, editable separation of the
preferred raster eagle/login references, redistributable asset licences, and native
coverage of all 125 colour/39 alpha design controls require source-backed audit.
Do not treat unresolved commands as runnable or mockup verification as native tests.
