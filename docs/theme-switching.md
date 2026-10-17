# Drokk desktop lifecycle

The development installation now uses Omarchy's `theme-set` user hook. Selecting
Drokk enables its optional appearance profile; selecting another theme restores
stock widget identities and the saved settings. The hook does not modify packaged
Omarchy code, run a resident watcher, or request administrator privileges.

The visible theme is **Drokk** (`~/.config/omarchy/themes/drokk`). Source/package
paths and companion IDs retain `mega-city-one` / `megacity.*` to avoid gratuitous
identity changes. The hook recognises both desktop slugs.

## Owned changes

- Six bar widget identities, the optional notification and lock services, and bar
  transparency. Existing widget positions, personal plugins and idle settings stay
  in the current shell configuration.
- Terminal font fragments, GTK imports, the monospace preference, Yazi theme and
  the owned cursor environment block. Only unchanged owned fragments are restored;
  edited fragments are preserved and reported.
- Interface font, cursor and optional icon selection. The next native theme owns
  its icon selection. Repeated Drokk selection reapplies its optional overlay
  after Omarchy's GNOME adapter without replacing the original preference.
- This machine's six previous personal-plugin colour patches are included only
  in its private migration profile. They are not portable plugin dependencies.
- When explicitly installed, the native [window card](window-card.md) adds a scoped
  load/enabled block and Super+Alt+I binding to the same profile. Removing its
  registration unloads a direct local library. A manager-loaded library can stay
  resident but defaults inactive: cards and input reservations are removed.
  No separate watcher or shell service is used.

Original Share Tech Mono draws shell text; JetBrains Nerd Font supplies missing
icon glyphs at Dune's native size. Terminals continue using patched Share Tech.
The bar is 28px high, with standard 16px icon canvases and 13px icon glyph size.
Drokk uses Hyprland's single border-gradient sweep with gold, pale gold and bronze;
its timing is `borderPulseSpeed` in the shared effects source.

## Runtime and recovery

The installed files are `~/.local/share/drokk/{theme-session,user-files}.mjs`,
`profile.json`, `~/.local/state/drokk/session.json` and
`~/.config/omarchy/hooks/theme-set.d/90-drokk-session`. The hook invokes the
Mise-selected Node 26.7.0 and uses `flock` to serialize overlapping invocations.
It ignores an event superseded by a newer theme selection and refuses to change
services while locked. Reapply the selected theme after unlocking if necessary.
When shell configuration or owned plugin QML must change, the hook stops the
unlocked shell before writing, then restarts it after the completed transaction
or restored failure. This avoids the observed IPC-registration crash during live
plugin replacement. Unchanged shell files do not trigger a restart.
Keep the profile/state until restoration is complete; neither is a whole-OS backup.

Disable all extras while retaining the ordinary theme:

```sh
mise exec node@26.7.0 -- node "$HOME/.local/share/drokk/theme-session.mjs" disable
```

Re-enable their automatic activation for Drokk:

```sh
mise exec node@26.7.0 -- node "$HOME/.local/share/drokk/theme-session.mjs" enable
```

Disable before removing companion files or this hook. Inspect reported conflicts;
do not delete state to suppress them. Installed fonts/icons/cursors remain available
while inactive but are not selected by the profile. Existing application windows
may need reopening to adopt restored fonts/styles.

The legacy migration uses recorded terminal/interface settings and exact owned
fragments. No original bar-transparency snapshot existed, so it explicitly restores
the normal opaque bar on first departure; subsequent activations capture the current
preference. The known iCloud source symlink was resolved once to its existing
user-owned checkout; runtime file operations reject symlinks.

## Observed acceptance and limits

On the recorded ARM64 host: live Dune → Drokk → Dune transitions, repeat selection,
disable/enable, all eight native companion removals, stock lock/notification service
availability while absent, clean reinstallation, manifest validation and inactive
rediscovery passed. An initial catalogue assertion ran before Omarchy's asynchronous
scan completed; the corrected finite check waits for that scan. Recovery restored
the removed directories on the initial failure. Temporary native removal backups
were deleted only after package hashes matched.

The package installer separately has fixture coverage for updates, failed updates,
reinstallation, ownership conflicts and removal. This is not a public Git-plugin
update test, clean-machine acceptance or a universal compatible installer. The
profile builder and one-time migration remain development tooling.

The card follow-up exposed two failures: the native loader retained an older card
library, and a theme switch crashed Quickshell during IPC registration. The card
now builds for real unloading and uses a distinct installed filename per build.
After the shell-write ordering fix, a new normal Dune → Drokk cycle removed and
restored the card and shortcut, kept the selected wallpaper, returned healthy
lock/notification IPC, and created no new crash report. This is a bounded live
regression result, not proof that arbitrary Quickshell hot reloads are safe.

SDDM is system-wide and independent of a user's desktop theme. This hook deliberately
has no privileged greeter operation. Its separate selection/recovery and real-login
check are described in [authentication screens](authentication-screens.md).
