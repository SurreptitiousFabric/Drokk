# Optional companions

The ordinary theme and companions are separate. The theme installer copies only
`theme/`; it never enables `plugins/` or installs SDDM. No supported public plugin
release has been published. Compatibility is limited to the [recorded baseline](compatibility.md).

| Companion | What changes | What stays native |
|---|---|---|
| megacity.menu | Eagle button and seven compact menu presentation bindings | Routes, application library/search, actions and keyboard handling |
| megacity.notifications | Semantic cards, placement/spacing, labelled sender action | Delivery, dismissal, DND, history and timers; category persistence has bounded metadata patches |
| megacity.lock | Clock/date, exact flat eagle, centred form and unblurred background | Pinned authentication/session-lock implementation inside the guarded service |
| megacity.workspaces | Numbered workspace presentation, selected/urgent states | Real compositor workspaces and focus dispatch |
| megacity.audio/network/bluetooth/power | State-dependent foreground colour | Pinned models, actions and popups |
| drokk-window-card (native Hyprland plugin) | Attached lower-right card and tuck tab | Compositor movement, stacking, window lifetime and input dispatch |

The [window card](window-card.md) is built and installed separately from the eight
Quickshell companions. It adds an exact compositor/compiler compatibility boundary
and follows the existing theme profile; ordinary theme installation never loads it.

The native root menu opens with Super+Space or the eagle; Super+Alt+Space opens
Apps. Both use the same native menu component. There is no separate custom
application launcher in the package.

Lock and notification `Service.qml` files are compatibility loaders; the adapted
implementation is `NativeService.qml`. Mismatch, check failure/timeout or custom
QML load failure selects the host's stock service. The lock implementation inside
that loader retains pinned service code; this does not mean the entry point is
byte-identical to stock. Menu/status/workspace companions do not have this runtime
gate and must not be enabled on unvalidated versions.

## Current development installation

These companions are installed and enabled locally. The reviewed lock/notification
guards were applied while unlocked, then shell restart, lock status and notification
ping succeeded. On 2026-10-17 the user reconfirmed a successful real lock/unlock
with the themed view after the guard update.
Native removal of all eight companions, stock service availability, clean reinstall,
validation and theme switching have now passed. The separately installed SDDM
theme has user-confirmed successful login after reboot on 2026-10-17.

The local personal-plugin bar-colour helper is separate development tooling. It
changes only already-installed view bindings and is never run by theme install.
It is not a dependency for other users. See [safety details](compatibility-and-safety.md).

## Disable and recovery

Omarchy provides plugin enable/disable/remove commands. These are recovery
instructions, not a claim that final removal has been exercised for every companion.
Preserve bar positions, settings and later user edits; do not reset the whole bar.

For the menu, the following restore/disable sequence was exercised locally:

```sh
omarchy bar put omarchy.menu --before megacity.menu
omarchy plugin disable megacity.menu
```

For lock, operate only while unlocked: disable `megacity.lock`, enable
`omarchy.lock`, then restart the shell. Never restart during a real lock.
For notifications, disable `megacity.notifications` and enable
`omarchy.notifications`; verify only the intended service owns notifications.
For status/workspaces, restore the corresponding stock entry at the recorded
position before removing the custom widget. Companion removal, updates and exact
settings restoration now have local evidence in [theme switching](theme-switching.md).
Public Git-plugin update and another host remain unverified.

Local recovery records live under `~/.local/state/thememe/`, including per-entry
companion metadata, original local bar views and the two original service entry
points saved for guard activation. These are small owned recovery records, not
whole-theme backups. Do not restore them blindly over later user changes.

SDDM has a separate [installation and recovery boundary](authentication-screens.md).

## Brit-Cit

The installed session profile now explicitly supports Brit-Cit. Variant overrides
exchange the bar/lock emblems, GTK imports and Yazi colours through the existing
owned-file transaction. Switching to Drokk restores the eagle; switching to a stock
theme restores stock components. Shared fonts, controls and card behaviour remain.
Lock SVGs embed each exact PNG without tracing or changing its pixels. Initial
registration can be prepared with `withVariantProfile` in session-profile.mjs;
it is not yet a public installer command. Login selection is separate and privileged;
see [authentication screens](authentication-screens.md).
