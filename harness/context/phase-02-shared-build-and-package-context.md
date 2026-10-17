# Phase 02 context: package and reversible lifecycle

## Dependency clarification

The active working-theme goal authorises repository implementation. Phase 01's
source promotion/specification are verified, but its VM provisioning prerequisite
remains open. Offline build/lifecycle fixture tests depend on the promoted source
contract, not a running VM. These slices may proceed while Phase 01 remains open;
native acceptance and phase completion still require the relevant environment.
No host activation or concurrent processes are authorised by this clarification.

## Public seams

The phase plan names build/check/install/remove CLI commands and fixture-HOME
lifecycle acceptance. Tests execute those public boundaries synchronously with
real temporary files. They catch propagation, invalid input, reproducibility,
conflicts, restoration and failure rollback. They cannot prove desktop rendering,
SDDM/PAM, hardware behaviour or active-theme switching.

| Operation | Owner | Focused check/gap |
|---|---|---|
| Source -> standalone package | scripts/build-theme.mjs; source model only | CLI build, known palette probe, deterministic manifest |
| Package integrity | scripts/theme.mjs check | File hashes and rejected invalid inputs |
| Stage/reapply/remove | scripts/install-theme.mjs | Temp HOME with existing files, edits, conflicts and rollback |
| Real activation/state services | Not implemented by offline package CLI | Native and target phases remain pending |

Implementation uses Node built-in modules, no new third-party dependency. Sources
must never import ignored output/ or installed template files at build time.
