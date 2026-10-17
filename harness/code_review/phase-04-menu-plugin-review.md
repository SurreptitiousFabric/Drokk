# Eagle menu widget review

Scope: three-file optional plugin, five-line build integration, package allowlist
and public build regression. Synchronous source review against AI-slop checklist.

No actionable source finding remains in this narrow slice. Reused native
BarWidget/BarIconButton and existing builder rather than adding an installer,
menu engine or service. Fixed click commands match stock behaviour and include no
user-controlled command fragments. SVG source has transparent cutouts, so tinting
preserves its geometry. Commons import is qualified for Qt naming compatibility.
Package path allowance is limited to this named optional plugin, not arbitrary
plugin roots. Normal installation still copies theme/ alone.

An initially proposed separate builder was discarded before implementation because
the existing package boundary can carry optional siblings. Focused test originally
failed on the absent builder; the interface was simplified to the existing build seam and passed after integration. Native manifest validation and live
bar rendering passed. The first immediate enable attempt preceded discovery and
was rejected; registry subsequently listed the plugin and enable succeeded.

Runtime host receives normal user privileges; no sandbox guarantee. Only the local
development Omarchy snapshot was tested. Source review and manifest validation do
not prove arbitrary future compatibility or supply a third-party security audit.
No delegated/human review is required by the user's accepted workflow.
