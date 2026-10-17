# Phase 05 context

Authorised: implement necessary lock/login presentation companions, preview before
activation. No authentication policy changes. No real session lock in this step.

The installed stock lock Service.qml owns PAM, WlSessionLock and password lifetime.
Pin it byte-for-byte and change LockView presentation only. Stock preview is
non-authenticating; a separate view harness tests input signals without PAM.
Clock/date/user/eagle/button share one centreline; stock masked input behaviour,
clear, errors, loading and fingerprint support must remain. Actual secure lock,
wrong/correct credentials, suspend and recovery remain manual acceptance gaps.

Consumers: generated plugin view uses shared palette/fonts and separate flat lock
asset; native service stays pinned; normal theme installer never copies plugins.
The raster flat asset and login illustration require explicit regeneration on
artwork changes; do not claim arbitrary raster palette recolouring.

Superseding user requirement: pixel-perfect original assets, no redraws. The new
vector was rejected and removed. Do not use the filtered historical screenshot
extract as an original transparent emblem. Native view source is unfinished and
excluded from package until exact artwork is resolved. No lock activation occurred.

Current implementation: package includes exact original lock-reference.png; view
uses sourceClipRect(758,370,156,110), without filters, redraws or recolouring. This
retains city pixels and the inspected native preview has a visible rectangle.
Do not activate or mark complete. An asynchronous question asks whether background
removal alone is allowed; no reply has been received. Native view check passes
submit/clear and disabled guard. Pinned Service.qml remains byte-identical.

User explicitly approved background removal and live lock activation. Added deterministic alpha-only extraction; verified every original RGB sample unchanged. Disabled view blur/contrast effect. Native view-only checks passed; activated megacity.lock, disabled stock lock clone source, restarted only while unlocked. Live native preview inspected: no background rectangle, sharp wallpaper. Stock service byte-identical; reports password PAM configured and two real screens. Actual lock/unlock and suspend acceptance still pending user interaction.

Later acceptance supersedes the manual-unlock gap above: on 2026-10-17 the user
reconfirmed successful real lock/unlock after the compatibility guard update.
This is user-observed authentication evidence on the current desktop. Suspend,
fingerprint, broader output coverage and recovery are not established by that
report. Current loader/native-service ownership is in docs/authentication-screens.md.
