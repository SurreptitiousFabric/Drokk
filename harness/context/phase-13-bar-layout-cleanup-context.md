# Bar layout cleanup context

The hook ran: Lumon uses native widget IDs and services. It did not restore positions
because those were explicitly recorded as a personal global arrangement on Oct 18.
Two pre-theme user config snapshots agree on native left menu/workspaces and center
indicators/clock/keyboard/weather/update. Use only those placement facts for live
repair; do not restore old whole configurations or remove newer personal widgets.

Existing session owner handles layout snapshot, application, restoration and state
rollback. Tests use the already agreed theme lifecycle seam: enter/reselect/change
variant/leave, unrelated additions, deliberate movement and failed transaction.
