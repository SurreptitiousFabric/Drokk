# Compatibility and safety implementation

For supported-version observations and outstanding acceptance, use the
[compatibility matrix](compatibility.md). For the current installation, use
[live status](live-feature-status.md). This page describes implemented protections.

## Ordinary installation

The generated theme selects stock Yaru-blue. Custom icon/cursor directories are
optional files and require separate user registration before selection. Ordinary
installation does not execute the local bar helper, enable companions, alter PAM,
or install/select SDDM. The release installer and optional asset lifecycle remain
unfinished; the supplied installer is fixture-only.

## Service compatibility loader

The canonical compatibility.json records the exact accepted Omarchy, Quickshell
and Hyprland packages. Generated lock/notification companions keep an independent
fingerprint check and NativeService.qml behind a small Service.qml loader.

The loader waits for host property injection, then checks package versions and
original host service hashes. Failure, mismatch or a three-second check timeout
loads the installed stock service. A custom QML load error also selects stock.
Timeout resolution chooses stock before stopping the process, preventing an exit
signal from selecting the custom branch. Native notification DND property/method
access is retained. The reviewed loaders are now applied live; post-restart status
and notification ping passed.

This protects the declared baseline, not every shared library, user modification
or future host API. Stock fallback assumes the stock file/path and service-loader
contract still work. Other optional menu/status/workspace companions have no
runtime compatibility gate. They require explicit validation before enabling on
another release; no theme installation enables them implicitly.

## Personal-plugin bar helper

The local helper preflights view anchors, every ancestor path, recovery copies and
receipt before writing. Symlinked plugin/recovery paths are refused using shared
validation. Same-directory staged replacement preserves permissions. Ordinary
write failure restores earlier views; recovery material remains if restoration
itself fails. The old receipt remains until its replacement succeeds.

Repeat runs retain original hashes and refuse later user edits or altered/missing
recovery copies. Entries for temporarily absent plugins are retained. These checks
do not claim power-loss durability or eliminate concurrent same-user filesystem
races. The helper is local tooling, not a public installation dependency.

## Regression evidence

Seven safety tests cover conflicts, parent symlinks, restoration, permission/hash
preservation, user edits, host fingerprints and native QML branch selection. The
QML fixture uses dummy services and tests match, mismatch and broken-custom-QML
fallback without authentication. Run `mise run theme:check-safety` for these tests;
`theme:test` includes them in its broader fixture suite. The actual notification
service also passed private-bus checks. AI-slop follow-up reused existing path
validation and kept native service behaviour rather than adding a general installer
or compatibility framework. Broader release acceptance remains outstanding.
