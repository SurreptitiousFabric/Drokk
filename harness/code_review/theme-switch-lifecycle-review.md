# Theme-switch lifecycle review — 2026-10-17

Scope: theme-session/profile/migration/user-files and live lifecycle check, shared
native border/font/icon settings, their tests and direct callers. Applied ai-slop's
21 checks synchronously; no delegation and no unrelated repository refactor.

Corrected findings:
- Repeated activation discarded the saved preference baseline. Behavioural RED,
  retained baseline, GREEN; later native icon reapplication also has a regression.
- A settings rollback failure prevented file restoration. File recovery now runs
  independently, reporting aggregate recovery failures rather than success.
- A removed companion could leave shell entries pointing at absent files. Profile
  preflight now restores stock operation and reports the missing component.
- A legacy lock test compared the guarded entry point with native service bytes.
  The byte-equality assertion now targets NativeService.qml; existing QML guard
  tests continue to exercise matching/mismatching hosts and failed custom loading.
- The live removal check assumed synchronous plugin discovery. Source confirmed
  the native rescan is asynchronous; a finite wait precedes catalogue assertions.

No additional actionable findings in the reviewed scope. Known boundaries remain:
settings are restored only when still owned; process-failure recovery is not
power-loss durability; legacy migration has no original transparency snapshot;
Mise/Node and the recorded host API are runtime dependencies. Public Git install/
update, other hosts and actual SDDM authentication are not established by this review.

Evidence: full 41-test suite passed; final session suite 11 passed; native checks
passed; real theme round trips and native eight-companion removal/reinstallation
passed. The greeter's ten file hashes/permissions and native form check passed.
Visible top-bar captures were inspected. Actual border movement awaits user visual
acceptance; no screenshot is claimed to prove motion or authentication.
