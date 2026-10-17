# Lock and login presentation

Lock and SDDM are separate optional components. Neither changes PAM, autologin,
authentication policy or session scripts. Theme installation does not activate them.

## Artwork and native controls

The lock uses the exact approved 156×110 eagle crop with authorised alpha-only
background removal. RGB samples are preserved; no redraw/recolour is substituted.
Clock, date, username and password controls are live. Native background blur is
disabled for the chosen presentation.

SDDM uses the approved monumental login image as background.png. An opaque live
form covers the painted controls inside the original gold plaque. The small form
insignia is an unmodified image region. Screen scaling changes display dimensions;
source-pixel fidelity does not mean the image is displayed at 1:1 on every output.

## Current installation and checks

The lock companion is enabled locally. Service.qml is now a compatibility loader;
NativeService.qml retains the pinned native lock-service implementation. Exact
host-version/file checks select our implementation, otherwise the host's stock
service is loaded. Custom-QML load errors also fall back. See [compatibility](compatibility.md).
The user reconfirmed successful real lock/unlock after the guard update on
2026-10-17. This closes that target-machine manual check; fingerprint,
suspend/resume and multi-output coverage remain unverified.

`mise run theme:check-lock` opens a finite view-only preview, checks submit/clear
and disabled input, and loads neither PAM nor WlSessionLock. `theme:check-login`
checks Qt form submission, password clearing, duplicate-submit prevention and
failure recovery with synthetic inputs. SDDM test mode previews real model wiring
without authentication. None proves successful login/session start.

The prepared SDDM theme is installed at `/usr/share/sddm/themes/mega-city-one/`
and selected by `/etc/sddm.conf.d/99-mega-city-one.conf`:

```ini
[Theme]
Current=mega-city-one
```

The original ten installed files were checked against the prepared package and
for root ownership and readability as the sddm account. Stock files and selection
remain intact. **On 2026-10-17 the user reported successful login after reboot.**
This closes the target-machine login check based on user observation. The earlier
form check and installed-file comparison are separate automated evidence. No real
password was supplied to the agent or recorded. The separate later lock/unlock
confirmation is recorded above; greeter recovery on failure remains unverified.

## Recovery boundary

Operate on the lock companion only while unlocked: disable `megacity.lock`, enable
`omarchy.lock`, then restart the shell. Never restart during a real lock. A broken
stock installation is outside what the compatibility fallback can repair.

SDDM installation uses a separate privileged helper that refuses existing target
and selection paths. Recovery is removal of the owned 99-mega-city-one.conf so the
existing stock selection applies; do not replace stock configuration. Final
privileged selection-removal and real-login recovery acceptance remain open. Never restart SDDM in
a working session as a preview technique. Do not record real passwords or input traces.

## Login check for future changes

Save work before logging out through Omarchy's normal session menu. Confirm the
monumental eagle background and live username/password/session controls, select
Hyprland, authenticate personally, and confirm the desktop starts. Never send or
record the password. A successful preview/form test does not substitute for this.
The current installation already has the user's reboot/login confirmation; this
procedure is retained for relevant future changes, not an outstanding repeat test.

If the themed greeter cannot be used, switch to a TTY (Ctrl+Alt+F3), authenticate
personally, and remove only `/etc/sddm.conf.d/99-mega-city-one.conf` after confirming
it still contains the recorded `[Theme]` / `Current=mega-city-one` selection. The
unchanged `/etc/sddm.conf.d/10-theme.conf` selects the stock `omarchy` greeter.
Restart SDDM only after accepting that any active graphical sessions will end.
Do not remove PAM, session, stock-theme or unrelated configuration files.

Desktop theme switching does not require or invoke this privileged operation.
