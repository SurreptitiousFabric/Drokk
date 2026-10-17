# Phase 06 context

Authorised: separate SDDM presentation package and non-authenticating test-mode
preview. Do not activate system greeter or restart display manager in this step.

Installed SDDM 0.21 Qt6 supports --test-mode --theme. Native sddm.login owns
credentials/session launch. Use userModel/sessionModel and native failure/success
signals, live controls and bundled fonts accessible from a self-contained folder.
Artwork is an edited clean version of the approved reference: blank central
plaque, no painted UI. Model drives palette/typography; raster colours require
regeneration. Actual greeter-account access, login/session and recovery pending.

Superseding user requirement: no redraws or regenerated assets. The AI-cleaned
login background was rejected and removed from canonical assets. Preserve the
original login reference unchanged; clean original artwork is not yet located.

Current implementation supersedes the clean-artwork requirement: preserve the
entire original login PNG byte-for-byte, cover only its painted controls with an
opaque native LoginForm inside the existing gold frame. Tiny form emblem also
uses unchanged source pixels. Native SDDM test-mode captured and inspected on
1728x1080 and 2400x1350 logical screens. Test-mode lastUser is empty, so username
placeholder and disabled Sign in are correct; session model selects real uwsm.
No system installation, greeter selection or real authentication performed.

User explicitly authorised installation and selection. Installed via pkexec using
reviewed bounded script: new theme directory and new 99-mega-city-one.conf only.
All 10 installed files byte-match package, root-owned, not group/world writable;
readability checked as sddm during installation. Stock 10-theme.conf untouched.
No /etc/sddm.conf theme override exists. Display manager remains active; no restart.
Real credentials/session-start acceptance remains for next normal user login.
