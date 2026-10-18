# Optional attached window card

`drokk-window-card` is a native Hyprland decoration, separate from the ordinary
Omarchy theme and the eight Quickshell companions. It renders the approved navy
card, red outline, gold oblique Nimbus Sans Narrow heading and gold tuck tab at
each normal window's lower-right corner. The body passes clicks through; the
exposed tab toggles the body. **Super+Alt+I** toggles the active window's card;
other windows keep their own state. The shortcut is installed and removed with
the card. Installation refuses to overwrite an existing binding for that chord.
Super+Shift+I is left for Omarchy's previous input language/layout action. The
replacement was checked against the installed bindings and upstream defaults at
commit `5fcdaca6495cac8931e0624c88414c95e0247585`; personal bindings still take
precedence through the installer's conflict check.
Small windows below 240×180 and fullscreen windows
hide the card. Each window owns its own open/tucked state until it closes.

The compositor owns movement, resize, workspace visibility, stacking and lifetime.
There is no polling process, layer-shell overlay or compositor function hook.
Current content is the real title, workspace and active/inactive state. Application
path, Git branch, file counts and disk space require separate adapters and are not
implemented. Tuck/open uses a 160ms eased slide; disabling Hyprland animations
makes it immediate. The body stays click-through during the slide.

The approved specimen includes a 204×120 body plus a raised 10px corner. Its tab
is 12px wide and overlaps the window edge by 3px, leaving 9px exposed. This follows
the reference renderer; the earlier specification's wording “protrudes 12px” was
ambiguous about that overlap. Only the exposed part receives native decoration
input. Hyprland reserves a 10px strip on the right so a tiled window's tab stays
inside its clickable layout area, including at the right screen edge. The card
is drawn above owner content and below its popups.

## hyprpm packaging

`mise run theme:package-card` generates `dist/drokk-window-card-source/`, a
standalone source package with `hyprpm.toml`, a native build command, licence,
instructions and paint/font header generated from the existing theme model.
Compilation requires native dependencies, without a Node or Mise runtime.
The [package instructions](../theme/mega-city-one/source/window-card/README.md)
describe installation, updates, integration and removal.

Initially accepts Hyprland commit `5c9377c15f85c50648f35ca5a213754f95b93ca0`
(0.56.1). Unknown commits fail before plugin compilation, even if they report the
same version number. Failed builds remove old output so hyprpm cannot accept a
stale binary. The runtime ABI check remains. After a compatible source revision
exists in published Git history, map supported Hyprland commits to that revision
using `commit_pins`. The public source repository has no standalone card release
yet; no fictional pins or broader version claims are included in the manifest.

Real hyprpm add/update/removal, revision selection, compilation and unsupported
build refusal have been checked in a disposable namespace sandbox. It reuses the
installed matching SDK and isolated compositor, without changing the real cache.
It does not certify fresh dependency installation or an Intel/AMD desktop.

After hyprpm installation/enabling, `install-hyprpm --live` registers its cached
binary in the existing Drokk profile. Use `remove-hyprpm --live` before removing
the manager package. These helpers neither copy nor delete the manager binary.
They target the inspected 0.56.1 manager cache layout.

## Build and local development installation

Initial compatibility is the recorded Hyprland 0.56.1 build and matching native
GCC compiler. The build requires installed Hyprland development headers,
`pkg-config`, Cairo/Pango, `g++` and `readelf`; it installs no dependencies.
The native plugin compares Hyprland's complete API/ABI hash before using internal
objects. It is built with `-fno-gnu-unique` so unloading releases the library.
Rebuild and revalidate after compositor updates; this is not a portable
prebuilt binary for all Omarchy versions or architectures.

This is a software-build dependency, not a restriction to one physical machine.
The source contains no machine identity requirement. Another supported setup
needs a binary built for its architecture and compatible Hyprland headers/compiler.
The current builder accepts only the listed 0.56.1 commit; other versions require
review and testing, and compositor updates can require rebuilding or source
changes. hyprpm packaging and rebuild checks are implemented. Publication and
other-architecture acceptance remain outstanding.

From the repository, with its Mise runtime pins:

```sh
mise run theme:build
mise run theme:build-card
# Starts a finite isolated compositor with dummy windows; obtain permission first.
mise run theme:check-card
# Explicit local activation, while unlocked and with the Drokk profile installed:
mise exec -- node scripts/window-card.mjs install --live
hyprctl plugin list
hyprctl configerrors
```

The build consumes the checked package's resolved `panel.*` colours and typography,
so palette/font changes require the theme build followed by the card build. Do not
edit a generated binary or keep a second palette. The optional artifact is
`dist/drokk-window-card/`; ordinary theme installation does not enable it.

The installer adds one owned block to `~/.config/hypr/looknfeel.lua` and records it
in the existing Drokk profile. The binary/build receipt live in
`~/.local/share/drokk/window-card/`; the installed binary filename contains its
SHA256 so an update cannot accidentally reopen an old cached library. The profile
removes the block, including the enabled setting and shortcut, on departure from
Drokk or when extras are disabled. Direct local installation unloads the library.
A hyprpm-loaded library can remain resident, with its default enabled setting
false: all cards and their input reservations are removed. Returning to Drokk
restores the registration. A missing binary is skipped. Edited owned fragments
are preserved and reported.

Remove the existing card before installing a different build. The installer refuses a
changed installed binary, an edited owned block, symlink paths and replacement
without removal. Installation does not alter packaged Omarchy files, authentication
or login settings. To remove just the card:

```sh
mise exec -- node scripts/window-card.mjs remove --live
hyprctl plugin list
```

## Verification boundary

Session fixtures cover theme departure/return, disable/enable and preservation of
later edits. Card fixtures cover geometry, tab hit area and install/remove ownership.
The finite native check uses actual dummy Qt windows and Wayland pointer input,
captures only that isolated desktop, and checks rendered pixels, click-through,
tuck/reopen, actual shortcut input, movement, resize, stacking, fullscreen,
rightmost tiled input at 1× and 2× scale, hidden grouped-window unload,
config reload, library unmapping and window closure. Manager-loaded libraries are
checked inactive by default, enabled by Drokk and cleared on departure, including
hidden grouped windows. `theme:check-card-hyprpm` adds the real manager sandbox
checks described above. Its temporary compositor and applications close
on completion or failure. It does not exercise real authentication or claim
other-machine compatibility. Current execution evidence is in the build log.

## Workspace row

The card uses `SPACE 4 (1, 2, 3)`: its window's workspace first, then other occupied
normal workspaces in numeric order. Empty and special/scratchpad workspaces are
omitted; duplicate windows on one workspace produce one entry. With no others,
show only `SPACE 4`. Named normal workspaces retain their names. Window open,
close and workspace-move events invalidate the card; no polling process is added.
Long rows retain the existing text ellipsis within the card's fixed width.

To match Omarchy's Super+0 shortcut, numeric workspace 10 is displayed as `0`,
both as owner and in brackets. Its real ID and ordering stay unchanged; custom
workspace names are preserved.
