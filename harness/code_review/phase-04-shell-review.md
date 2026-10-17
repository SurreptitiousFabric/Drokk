# Phase 04 notification component review

Scope: NotificationCard.qml template, generated card/icons, QtTest fixture and
finite native runner. Synchronous AI-slop checklist review.

One palette/template supplies generated output. No daemon/history owner added.
QtTest clicks exercise actual controls rather than calling signal handlers.
Native Qt loaded/rendered the component with bundled font discovery; download
capture inspected at native size. Public build probe verifies palette propagation.

Remaining gaps: live service adoption, category mapping, app icon lookup, rich-body
handling, viewport maximum, keyboard/accessibility and action capability mapping.
Only supply actionLabel when the corresponding default action exists. This component
is not the completed notifications feature; offscreen output proves no compositor
blur, real timeout/history or desktop acceptance.

Notification action correction: removed both generic Open fallbacks. Exec-only
notifications have no invented link; explicit native default-action text retained.
Original service click execution untouched. Controlled native toast visually
verified without link; 22 package tests and 6 Qt notification entries pass.
Other notification fidelity gaps remain open; no unrelated fixes made.
