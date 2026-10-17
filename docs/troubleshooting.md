# Troubleshooting

Use the [compatibility matrix](compatibility.md) first. Do not reset all Omarchy
configuration or install missing components merely to force a visual match.

| Symptom | Check and bounded action |
|---|---|
| Existing Files windows look grey | A running Files process may retain old CSS. Close/reopen Files when convenient; do not kill unrelated work. A fresh process was checked with the navy styling. |
| Terminal still uses another font | User font settings can override a theme include. Check `fc-match 'ShureTechMono Nerd Font Mono'` and the application's own font setting. Reopen the terminal without terminating running sessions. |
| Custom folders/cursor absent on another machine | Ordinary installs deliberately use stock icons. Files nested under a theme are not automatically registered icon/cursor themes. Custom assets require separate opt-in registration and native lookup checks. |
| Lock or notifications look stock after an update | The service guard may have rejected the new baseline. Keep stock active and compare installed packages with the recorded baseline; do not disable the guard. |
| Notification has no action link | Expected unless the sender supplies an explicit default-action label. There is no generic Open action. |
| Notification has an information tile | Sender category/icon metadata may be absent. The theme does not infer status from arbitrary message wording. |
| Qt geometry differs from GTK | Qt uses its native style with palette/font adoption through the existing GTK3 bridge. Arbitrary application chrome is not replaced. |
| Browser/editor ignores some colours | App extensions, user templates and application-owned chrome may override or ignore theme output. Generated configuration alone does not prove adoption. |
| Installed theme is different from the local development copy | Check the release payload layout and Omarchy's Git-install filtering; see compatibility.md. |
| Patch helper refuses a file | Preserve the receipt/recovery copies. User edits, redirected paths or an upstream plugin change require explicit reconciliation; do not delete state to force a patch. |

When reporting a problem, provide component versions, the affected surface, expected
versus actual behaviour and a minimal reproduction. Crop screenshots to the theme
surface. Do not share passwords, tokens, private notification history or raw
session dumps.

For companion disabling and lock/login recovery, use the relevant guide rather
than a whole-desktop reset. Never restart the shell while the session is locked,
and never restart SDDM as a preview technique in a working session.
