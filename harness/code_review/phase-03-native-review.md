# Phase 03 native adapter review

Scope: terminal-theme.mjs, desktop-theme.mjs, native check runner/Lua helper,
build integration, task and relevant public build regressions. Synchronous review
against requirements/AI-slop checklist; content hashes in local phase-03-checks.json.

No additional actionable slop finding remains in the implemented source-adapter
slice. The distinct terminal formats are generated from one ordered ANSI role map;
desktop adapters share the same palette and do not own live application state.
The Aether integration uses the installed plugin contract rather than another editor
theme engine. Native tests call real parsers/APIs under isolated config state,
not private method mocks or success strings. Failures/missing dependencies are not
silently skipped. No package/dependency install or user-settings rewrite is hidden.

Material limits remain: natively parsed files are not active desktop adoption;
stock/user include precedence needs actual settings integration. 16px/12pt conversion
assumes 96dpi for formats without the selected pixel syntax. Native Hyprland blur
and all visual/transparency/font/selection states require real comparison. btop,
Kitty/Alacritty, GTK/Qt and the full remaining 24-area contract are not accepted by
these checks. There is no authentication claim.

Twelve package/fixture tests passed; generated 24-file package check passed; available
native parser/font/Neovim checks passed. Three deliberately invalid parser controls
were rejected. See [native adapter documentation](../../docs/native-adapters.md),
[phase context](../context/phase-03-native-desktop-context.md) and [project log](../build-log.md).

## Application/settings review follow-up

Synchronous review of application-theme.mjs, configure-theme.mjs and their direct
CLI/build/native-check consumers found two concrete gaps (checklist 14/15): the
user-edit test had no original backup and restoration accepted receipt symlinks.
The strengthened test now checks real backup/receipt bytes. A new public-CLI test
failed when redirected receipt restoration succeeded; reuse of rejectSymlinks fixes
it. File-mode restoration is also checked after the explicit chmod umask fix.

No new palette/transaction framework was added. GTK checks call native library
parsers. Settings crash durability and mid-write failure recovery remain unproven;
Qt/browser adoption and Yazi colours remain unresolved. Old counts above describe
the earlier slice; appended build-log entries own current verification.
