# Compatibility and release acceptance

The optional [native window card](window-card.md) additionally requires a build
against the exact running Hyprland ABI and matching native compiler. The initial
checked target is Hyprland 0.56.1 with GCC 16.1.1 on this ARM64 host. It is separate
from the ordinary theme and from the Quickshell companion version guards.
The generated hyprpm source package accepts only the tested 0.56.1 commit, checks
the compiler and retains the runtime ABI guard. Real manager installation,
revision pin selection, update and removal pass in an isolated local fixture.
Public publication, release commit pins, fresh dependency setup and x86_64 desktop
acceptance remain outstanding. See the [card guide](window-card.md).

## Recorded baseline

Package identities were rechecked on 2026-10-17. This is one development machine,
not a supported-version range or a clean-install certification.

| Component | Observed version | Evidence boundary |
|---|---|---|
| Architecture | aarch64 | ARM64 desktop only; x86_64 not validated |
| Omarchy | omarchy-dev 4.0.0.r6589.gdec29fa-1 | Local live installation |
| Quickshell | quickshell-git 0.3.0.r20.g28771c7-1 | Native cards, service guard and private notification checks |
| Hyprland | 0.56.1-3 | Lua configuration, live bar/workspaces and cursor |
| Qt | qt6-base 6.11.2-3; qt6-declarative 6.11.2-1 | Native widget/form checks |
| SDDM | 0.21.0-7 | Installed theme/form checks; user-confirmed successful login after reboot on 2026-10-17 |
| GTK | gtk3 1:3.24.52-1; gtk4 1:4.22.4-1 | CSS parsing and native controls |
| libadwaita | 1:1.9.3-1 | Fresh Files appearance checked locally |
| Foot | 1.27.0-1 | Parser, bundled font and visible terminal checks |

The exact service gate is [compatibility.json](../theme/mega-city-one/source/compatibility.json).
Qt/GTK entries above document observations; they are not additional enforced gates.

## Different compatibility boundaries

| Part | Current protection | Remaining validation |
|---|---|---|
| Ordinary theme | Native data/config; no companion activation | Selected Omarchy release and actual Git-install staging |
| Lock/notifications | Exact package and original-service hashes; stock fallback on failure, timeout or custom QML load error | Host service-loader contract, actual lock behaviour after updates, fallback on another complete system |
| Menu/status/workspaces | Pinned source and preserved native behaviour | No automatic runtime version guard; validate each supported release before enabling |
| GTK/Qt/icons/cursor/fonts | Optional explicit local adoption | Settings ownership, removal, theme switching and conflicting user configuration |
| SDDM | Separate install, no PAM/session-policy changes; local reboot/login confirmed | Other-machine login and privileged selection-removal recovery |
| Personal third-party bar patches | Exact text anchors, path checks and recovery | Local helper only; exclude from default public installation |

The guard assumes the host still has a working stock service at the expected path
and the service-loader API. It cannot repair a broken Omarchy installation.
After an unaccepted update, keep stock services; do not widen version ranges just
to suppress a mismatch. Validate and record a new baseline before changing the gate.

## Publishing with limited compatibility evidence

No second installation is currently arranged. Publishing the source as an early
release can carry the explicit statement: tested on the ARM64 development setup
listed above; other Omarchy releases, architectures and configurations are
unverified. This is a limit on support claims, not a requirement to obtain another
machine before sharing the project. Compatibility reports can extend the matrix
when they identify the versions, components and operations actually tested.

The public install layout and route still need verification. A working local
copy does not establish that Omarchy's installer will preserve every override or
install the optional companions. Keep this gap visible even in an early release.

## Checks before expanding support

1. Choose the first public target release/architecture. The current `omarchy-dev`
   baseline is not evidence that stable Omarchy or x86_64 behaves identically.
2. Prepare a theme-only release payload with `colors.toml` at its repository root.
   Publish companions separately with explicit activation and retained notices.
   No release URL exists yet.
3. Exercise the real `omarchy theme install` route on a clean target. Current
   upstream Quattro documentation says Git-installed themes filter Lua and full
   terminal configurations, then generate replacements from native templates.
   Therefore local copies of our overrides are not public-install evidence.
   Prefer supported palette/template mechanisms; do not bypass upstream filtering.
4. Check native appearance and behaviour with companions disabled, then enable
   each optional companion separately. Test version mismatch/load failure, existing
   plugins, user overrides, multiple outputs/scaling and relevant keyboard paths.
5. When another target is available, check its login and recovery. Local reboot/login
   is user-confirmed; companion removal/reinstallation, disable/enable and theme
   switching pass; update and failure restoration have fixture evidence. See
   [reconciliation](acceptance.md) for the remaining per-surface gaps.
6. Publish only the verified matrix and known limitations. Recheck after dependency
   updates; do not imply unlimited forward compatibility from source hashes.

This is a compatibility checklist, not authorisation to provision a VM, upgrade
the host or log out. The current follow-up authorises documentation updates;
another installation has not been arranged.

## Primary sources and version distinction

The [upstream theming guide](https://github.com/omacom/omarchy/blob/quattro/docs/theming.md)
was checked on 2026-10-17. Its Git-install filtering differs from the inspected
local theme-set script, which contains no equivalent filter. Both observations
must remain separate: upstream branch behaviour is not assumed present locally.
The [upstream shell documentation](https://github.com/omacom/omarchy/blob/quattro/shell/README.md)
is an entry point for the matching plugin/service API documentation. These links
track a moving branch; pin the release sources when accepting another baseline.
