# Testing and evidence boundaries

Tests run synchronously; no persistent QA session, competing host notification
server or VM is implicitly started. The [compatibility matrix](compatibility.md)
is the authority for the recorded target. No clean independent desktop/VM acceptance
has been established. A prior inspection found KVM available but no prepared VM;
that observation is not a provisioning recipe.

## Available checks

| Command | Purpose | Boundary/dependencies |
|---|---|---|
| mise run theme:check | Generated payload hashes/paths | Existing build; no live activation |
| mise run theme:check-safety | Bar conflict/path/write-failure/user-edit regressions and QML guard fallback | Node plus native qs for finite dummy-service fixtures |
| mise run theme:test | All package and fixture tests, including safety tests | Includes lifecycle fixtures; not final live companion lifecycle acceptance |
| mise run theme:check-native | Terminal/Hyprland parsers, fonts/Aether, GTK CSS, Yazi TOML and font fixture | Installed native tools; fails when required dependencies are missing |
| mise run theme:check-shell | Native notification card controls/categories/hover/content | Qt qmltestrunner, finite offscreen UI; not the daemon |
| mise run theme:check-notification-service | Sender action, dismissal, DND/history/category and timeout | Private D-Bus session, native qs, explicit Mise Python 3.14.7 with matching distro GI libraries |
| mise run theme:check-cursor | Xcursor states/sizes, frames/hotspots | Native libXcursor |
| mise run theme:check-lock | View/input preview | Finite native qs window; no PAM or session lock |
| mise run theme:check-login | Login form interactions | Native Qt fixture; no real credentials or session start |
| mise run theme:check-card | Real attached-card rendering/input and native unload/reload | Explicitly authorised finite isolated Hyprland session; dummy Qt windows and virtual pointer, no host input |
| mise run theme:check-card-hyprpm | Card checks plus real manager add/pins/build/update/refusal/remove | Explicitly authorised disposable filesystem/user/network namespaces; matching installed SDK; real cache and project Git history untouched |

The project pins Node 26.7.0 and Python 3.13.15 in mise.toml. GUI/GI checks that need
the installed distribution's Python 3.14 ABI explicitly select Mise Python 3.14.7;
the default project pin is not silently replaced. Review each check's source before
running it on a different distribution. Native-check dependencies include Foot,
Ghostty, Hyprland, Fontconfig, GTK libraries and Neovim with Aether v3.
THEMEME_AETHER_PATH can select an existing Aether checkout. The Ghostty executable
on the development machine is user-local; it is not evidence of a distro package.

## Visual evidence

Finite owned-window and native-buffer fixtures checked Files, GTK/Qt, Foot,
Neovim, btop and Yazi. Capture only controlled QA surfaces, not unrelated desktop
content. Screenshots and passing parsers are different evidence. Accessibility/
portal warnings occurred during QA and are not claimed absent on all setups.

## Remaining acceptance

The user has authorised the final acceptance work. Local companion lifecycle and
reconciliation results are in [acceptance](acceptance.md). On 2026-10-17 the user
confirmed successful login after reboot and approved the live border pulse.
Those are user observations, separate from the automated results above.

No separate clean target has been arranged. Other releases, architectures and
installations remain unverified; publication can state that limited coverage
without claiming general compatibility. The public install route still needs
verification. Before any later provisioning, define the target release,
architecture, package sources and recovery route; do not invent an image URL
or upgrade the host to fit the theme. Isolated authentication tests use disposable
test accounts without retaining credentials. A private-bus service fixture is
not a second complete desktop.
