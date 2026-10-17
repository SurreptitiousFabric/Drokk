# Native application screenshots

These images were copied unchanged from owned native QA captures on the recorded
2026-10-17 development setup. They are example appearance evidence, not proof of
public installation or universal application support.

- [Terminal](terminal.png): controlled palette/font sample; status/error strings
  are specimen text, not a report of repository/network state. Capture opacity is
  1 for privacy; the live terminal setting remains .92.
- [Files](files.png): fresh native Files process showing generated navy styling and
  custom folder icons. A normal new installation uses stock icons until explicit
  custom asset adoption. This is not an independent clean-install screenshot.

Original project artwork is covered by the [artwork licence](../../ARTWORK-LICENSE.md);
third-party application material retains its own rights and notices.

## GitHub presentation plan

The following media are proposed, not yet captured. Use the working desktop for
screenshots and video. The existing terminal/Files QA images above remain examples,
not the final release presentation.

The current [Omarchy registry submission guide](https://github.com/omacom/omarchy-theme-registry#submit-your-theme)
asks for a public theme repository with a 16:9 `preview.png` at its root. Its
validator requires the preview to be at least 1000 pixels wide. A video is not
listed as a submission requirement. Recheck these rules at publication time.

Prepare one clear 1920×1080 desktop preview, plus separate lock and login stills.
Label a still from a non-authenticating preview as a preview. Captions must say
which features need companions or separate SDDM installation; the main image
must not imply the ordinary theme install alone supplies every optional feature.

A suggested 45–60 second silent demo:

| Approximate time | Show |
|---|---|
| 0–10 seconds | Wallpaper, top bar, terminal and Files |
| 10–20 seconds | Move/focus a window to show the gold pulse; change workspace |
| 20–30 seconds | Open the native launcher and search for an application |
| 30–40 seconds | Show a controlled sample notification and its dismissal |
| 40–60 seconds | Switch to another theme and back, showing the extras restore correctly |

Use prepared sample windows and notifications. Keep personal messages, paths and
credentials out of the capture. Lock/login stills can follow the desktop clip;
there is no need to record authentication or interrupt a working session for the
demo. Show a theme-only view alongside the companion view if both are advertised.

Export as an H.264 MP4 and link it from the README. GitHub supports video attachments
and recommends H.264 for browser compatibility; aim below its 10 MB free-plan
video-upload limit. See [GitHub attachment documentation](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files).
Keep a still preview for readers who do not play the clip. A demo shows appearance
and behaviour on this machine; it does not establish installation compatibility.
