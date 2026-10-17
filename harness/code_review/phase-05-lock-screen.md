# Lock companion review

Synchronous ai-slop/source review, 2026-10-17. Scope: lock-plugin.mjs,
Composition.qml.fragment, check-lock.mjs, tests/lock-preview.qml and package seam.

- Authentication boundary: generated Service.qml is byte-identical to pinned
  stock source; no new PAM/lock protocol or credential logging added.
- View: retains masked input, zero mask delay, native sync/clear/failure behaviour,
  fingerprint hint. New button emits existing submit/clear signals; checks pass.
- Artwork: exact approved PNG hash fixed in tests. No transparency operation is
  performed. City rectangle visible around eagle is a blocking visual finding,
  not waived by passing tests. Companion not installed/enabled.
- Preview runner loads only view, uses finite timeout, checks success marker and
  deletes temporary files. Native module symlinks point to installed read-only
  Commons/Ui; only synthetic input is used. No independent authentication claim.
- Actual secure lock coverage, keyboard/layout/Caps Lock, wrong/correct credentials,
  fingerprint, suspend/resume and recovery remain unverified. Phase incomplete.

Resolution: user approved alpha-only removal and activation. extract-lock-emblem.mjs preserves all RGB samples exactly (explicit raw RGB comparison), changes only alpha, performs no redraw/recolour. Native preview inspected without rectangle. Companion active; stock service unchanged. All 22 package tests passed. Source screenshot retained canonically but removed from runtime plugin payload as unused. Real authentication acceptance remains unverified, not inferred from preview.
