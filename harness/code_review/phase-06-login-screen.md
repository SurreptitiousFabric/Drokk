# Login presentation review

Synchronous ai-slop/source review, 2026-10-17. Scope: source/sddm,
check-login.mjs, tests/login.qml, build packaging and original-art preservation.

- Existing SDDM owns authentication/session start through sddm.login. Main.qml
  binds its user/session models and success/failure signals; no shell exec,
  network, PAM policy, autologin or credential persistence was introduced.
- LoginForm clears password immediately on submit, blocks duplicate attempts
  while busy, restores focus after failure. Native Qt tests pass. No empty-user
  or missing-session submission. Keyboard Tab/Return bindings remain native.
- Original image SHA256 fixed to approved reference; opaque form covers all old
  controls. Both logical monitor sizes captured and inspected with actual SDDM
  test-mode models. Fonts and both OFL notices packaged locally.
- SDDM preview timeout exits 124 by design; evidence is its captured rendering
  and loading logs, not a clean process-exit claim. Missing auth socket expected
  in test mode. Initial short runs missed window capture, later internal capture
  succeeded. No real credentials submitted in these runs.
- Root-owned installation, greeter-account file access, keyboard-layout/Caps Lock,
  real login/session and recovery acceptance remain unverified. Phase incomplete.

Installation review: install-login-system.sh refuses pre-existing target/selection
and source symlinks, stages root-owned 0644 files in a 0755 directory, verifies
source bytes and greeter-account readability, publishes separate selection without
overwrite, cleans incomplete staging. No service restart or policy mutation.
Authorised install completed; post-install byte/ownership checks passed 10 files.
Real login authentication still pending.
