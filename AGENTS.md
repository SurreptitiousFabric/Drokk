# Working instructions

Work synchronously. Do not spawn subagents, delegate, start background tasks,
schedule work or continuously poll unless the user explicitly authorises it.
Before doing so, explain the proposed task and wait for explicit approval.
During ongoing work, provide a user-facing progress update at least every ten
seconds. Keep tool waits short enough to meet that cadence.

Preserve existing files and unsaved work. Never maintain a machine log.
harness/build-log.md is a project implementation record, not a machine log.
Never record secrets, passwords, clipboard contents, raw diagnostic dumps or
secret-bearing URLs. Record commands only when actually observed.

Before phase work, read [GOALS.md](GOALS.md), [PLANS.md](PLANS.md), the named
phase, its existing context and [build log](harness/build-log.md). Follow
[PROMPTS.md](PROMPTS.md) for discovery, checks, context, reviews and evidence.
Plans own scope; context owns decisions; the build log owns execution status.
Do not mistake a completed plan, mockup or structural check for a working theme.

Use the installed omarchy skill for desktop/config work. Read-only inspection of
/usr/share/omarchy is allowed; never modify packaged Omarchy files there.
Use user-owned themes/plugins and preserve the current configuration. The goal
includes reversible installation; actual activation follows the recorded
session authorisation. Do all preparatory work before any required final approval.
No authentication policy, PAM, credential or session-security changes belong
in this theme. Read the imagegen skill when generating/editing bitmap artwork;
use native vector/code assets where that is the established asset format.

Use Mise for supported runtimes/tools. Preserve existing configuration, select
project-local pinned versions, verify mise current and the resolved executable,
and never silently fall through to system runtimes. Do not install global tools.
For production logic, use the TDD skill for meaningful behavioural RED/GREEN and
ai-slop for the final code review. Documentation and reversible cosmetic tweaks
use appropriate document/visual checks rather than artificial unit tests.

Before Git changes inspect branch, status and relevant diffs. Git initialisation
is authorised; commits, remotes and pushes are not authorised by the current
planning request. Preserve all generated design history. Do not edit Proof.

For remote authentication diagnosis, distinguish transport/DNS/sandbox/keyring
from service authentication. Never declare credentials invalid from a restricted
network failure. Confirm reachability and the smallest non-secret remote check;
report uncertainty unless the service establishes the credential state. Do not
change credential lifecycle without explicit approval for that exact change.
