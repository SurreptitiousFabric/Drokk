# Phase 01 context: specification and baseline

## Authorisation and boundaries

The active goal continuation instructs work toward the working Mega-City One theme,
including implementation after plan setup. This authorises this repository-local
source/specification audit and local runtime pin. No host activation, service launch,
VM provisioning, dependency installation, commit/push or concurrent work occurred.
User synchronous/no-background rules remain binding.

## Sources and consumers

Read the local phase plan, instructions and source models. The tracked
[specification](../../docs/mega-city-one-spec.md) owns all 24 requirements and
operation-level checks; do not duplicate its matrix here.

| Affected operation | Owner/location | Existing evidence or gap |
|---|---|---|
| Resolve/render colours, alphas, fonts, assets | theme/mega-city-one/source/; production renderer not yet written | 27 promoted files fingerprinted; 125 colour/39 alpha design controls; existing output checks are design-only |
| Generate native terminal/shell/Hyprland/Neovim/btop/browser config | Installed /usr/share/omarchy/default/themed/ and future repo generator | Native template/schema sources inspected; no production emitter yet |
| Apply/remove/recover user config | Future installer; local baseline under harness/evidence/ | Nine path/type/hash records, no content; not yet a restorable backup |
| Render exact launcher/notifications and comic cards | Future user-owned QML views with stock state/services retained | Stock Menu.qml/NotificationCard.qml inspected; exact geometry/semantic roles require custom work |
| Lock preview versus actual lock/authentication | LockView.qml + stock Service.qml | Installed preview has disabled input; distinct WlSessionLock/PAM seam; no IPC or lock invoked |
| SDDM presentation versus session startup | Separate SDDM theme/adapter | Greeter --help confirms --test-mode/--theme; no greeter/real login run |
| Fonts/third-party assets | Bundled OFL fonts and external Nimbus | Existing licence notices retained; Nimbus package licence differs and is not bundled |

## Material decisions

- Keep both editable classic eagle and richer raster lock reference; do not
  substitute one for the other. Clean lock/login layers still need production work.
- Public redistribution is not part of this local goal. Third-party plugin art/code
  and font distribution need their specific notices; path availability is not a licence.
- Pin existing Node 26.7.0 in mise.toml. Observed mise current node reported 26.7.0;
  mise exec -- which node resolved /home/swa/.local/share/mise/installs/node/26.7.0/bin/node.
  No runtime install or global selection change.
- The stock theme-set source starts parallel/background work. Do not invoke it
  under synchronous-only authority without a compliant strategy/current authorisation.
- GTK global palette is not provided by the inspected stock GNOME adapter. Scope
  actual GTK/libadwaita support and preserve exact requested visuals as acceptance.
- Titlebar region is not a global Hyprland server decoration; comic overlays need
  real owner tracking/input rules. Do not implement them as static screenshot labels.

## Environment and unresolved prerequisites

Host is ARM64 with /dev/kvm. No qemu-system-aarch64/x86_64, virsh or virt-install on
PATH was found. [Environment notes](../../docs/test-environment.md) distinguish
known preview seams from unestablished full isolation/provisioning. Phase 01 is
not complete while its matching test-environment selection/setup recipe remains
unresolved. Clean authentication artwork and cursor sources are explicitly assigned
later implementation work, not claimed as delivered here.

Source provenance and installed source hashes are recorded in tracked manifests;
local user baseline fingerprints are ignored evidence with no config contents.
No generated history or installed user config was edited by this phase work.
