# Current live status

Recorded 2026-10-17. The visible theme is **Drokk**; internal source/package names
remain `mega-city-one`. This is one ARM64 development machine, not a public release.
The [24-area reconciliation](acceptance.md) lists every implemented surface and gap.

| Area | Observed result | Remaining limit |
|---|---|---|
| Theme switching | Native Dune/Drokk transitions remove/reapply owned changes including the card/shortcut; shell stops before watched files change; corrected cycle had no new crash report | Other hosts and public install route unverified; upstream Quickshell hot-reload defect not independently fixed |
| Companion lifecycle | All eight removed through Omarchy; stock services available; clean reinstall, manifest validation and inactive discovery passed | Public Git-plugin update not exercised |
| Package lifecycle | Existing install/reapply/update/failure/remove fixtures pass | No clean independent desktop installation |
| Borders | Gold/pale-gold/bronze native single sweep, Dune timing; user approved the live pulse on 2026-10-17 | Other outputs/scales unverified |
| Attached window card | Optional native plugin installed live; standalone hyprpm source package; real manager install/pins/rebuild/refusal/removal checked in a sandbox; managed library inactive outside Drokk; existing input/animation checks pass | Application-specific metadata unfinished; only the tested 0.56.1 commit accepted; publication and x86_64/mixed-output acceptance outstanding |
| Bar/icons/type | 28px bar; Dune-size Nerd icon glyphs; native eagle size; Share Tech shell text; captures inspected | Other outputs/scales unverified |
| Menu width | Super+Space root menu 300px; Apps remains 360px; both measured from native rendered borders at 2× and visually inspected | Other routes keep their previous widths |
| Notifications | Sender-specific actions and semantic cards; service ping and prior private-bus behaviour checks | All sender metadata/timing/accessibility states unverified |
| GTK/Files/Qt | Earlier native captures and current parser checks; owned styles restored on departure | Existing applications can retain styling; Qt keeps native geometry |
| Icons/cursor/fonts | Optional selection follows theme; original settings restored; real font lookup verified | All DPI/app paths unverified; assets remain installed while inactive |
| Neovim/btop/Yazi | Native adapters and earlier captures; current parser/highlight checks; Yazi restoration checked | Not every application/plugin state tested |
| Lock | Exact flat emblem and guarded native service; user reconfirmed real lock/unlock after the guard update on 2026-10-17 | Additional authentication/output states, including suspend and fingerprint, remain unverified |
| SDDM | Installed-file/form checks pass; user confirmed successful login after reboot on 2026-10-17 | Other-machine login and selection-removal recovery unverified; greeter selection is separate/system-wide |
| Browser/other terminals | Adapters generated; Ghostty parser checked | Browser appearance and Kitty/Alacritty native acceptance not recorded |

Latest ordinary package: 200 payload files; the native card is a separate optional
artifact. Full suite: 49 passed after hyprpm packaging and lifecycle checks. Native parser/font/
GTK/Yazi checks passed. Service startup is asynchronous: immediate lock/notification
IPC briefly reported absent targets after restart; subsequent checks returned normal
unlocked status and notification `ok`. This is not real authentication evidence.

The two formerly excluded groups are now authorised. Local desktop lifecycle and
24-area reconciliation are recorded; the user's successful reboot/login and approval
of the border pulse close those two local checks. Other-machine testing remains
unverified with no agreed environment. [Theme switching](theme-switching.md) documents
ownership, conflict handling and the explicit disable/enable controls.

The [build log](../harness/build-log.md) records failures and corrections. Public
sample screenshots are in [screenshots](screenshots/README.md); detailed local QA
captures stay in ignored harness/evidence and show only controlled surfaces.
