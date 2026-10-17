# Drokk window card

Optional native Hyprland decoration for Drokk: window-attached cards, a clickable
gold tuck tab and Super+Alt+I for the active window. Code is 0BSD licensed.

This source package is generated from the theme's canonical palette/fonts and
native source. `CardTheme.hpp` is generated; change the theme model and regenerate
the package rather than maintaining another palette here.

## Supported build

Initially accepts Hyprland 0.56.1, commit
`5c9377c15f85c50648f35ca5a213754f95b93ca0`. `Compatibility.hpp` rejects other
commits before compiling the plugin. A second check refuses a mismatched runtime
API/ABI when loading. This supports building for the recipient's architecture;
the recorded desktop acceptance is ARM64 only.

Requires Bash, a matching native GCC C++ compiler, binutils/readelf, pkg-config,
Hyprland headers and Cairo/Pango development libraries. hyprpm also requires its
own documented build tools. Node and Mise are not needed to build this package:

```sh
bash build.sh
```

## Installation with hyprpm

Publish the contents of this directory as a Git repository, then use its actual
URL with `hyprpm add`. There is no published Drokk card URL yet. The manager reads
`hyprpm.toml` and runs the same build command shown above. Review the source before
accepting hyprpm's installation prompt.

After adding the repository:

```sh
hyprpm enable drokk-window-card
```

The plugin defaults to inactive. On an installation with the Drokk session profile
already set up, use its repository helper once while unlocked:

```sh
mise exec -- node scripts/window-card.mjs install-hyprpm --live
```

Remove the local development card with `remove --live` before selecting this mode.
The helper registers the manager-owned binary; it does not copy it or install a
second library. Drokk's profile owns the enabled setting and keyboard shortcut.
Switching away removes the cards, their input reservations and the shortcut,
including when hyprpm keeps the library loaded. No privileged manager command
runs during a theme switch. A fresh public theme/profile installer is separate
release work; hyprpm alone installs only this card library.

## Updates and removal

```sh
hyprpm update
hyprpm reload -f
```

The forced reload replaces a library already loaded in the current compositor;
the native enabled setting still follows Drokk's profile. Unsupported versions
fail the build instead of reusing an old output. A failed repository can also
block other plugin updates: follow hyprpm's report and disable/remove an
unsupported card rather than bypassing its checks.

To remove the integration, run the theme helper while unlocked:

```sh
mise exec -- node scripts/window-card.mjs remove-hyprpm --live
hyprpm disable drokk-window-card
hyprpm remove drokk-window-card
```

The helper removes only its owned profile fragment; hyprpm owns deleting its
binary. Edited owned fragments are preserved for reconciliation.

## Maintaining versions

Test each supported Hyprland release and update `Compatibility.hpp` only after
acceptance. Keep old compatible plugin revisions in Git history. Populate the
manifest's `commit_pins` with real Hyprland-commit/plugin-commit pairs after the
compatible source has been committed. The next manifest commit can then refer to
that existing source commit. Never invent a revision or pin an untested version.

The initial generated manifest has no pins because a standalone card release has
not yet been published. Its exact-commit guard remains enforced even when hyprpm
falls back to the latest source. Version pins select maintained source; they do
not automatically repair code after Hyprland API changes.
