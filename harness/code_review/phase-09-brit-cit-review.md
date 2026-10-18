# Brit-Cit bounded review

Reviewed the variant build, shared identity parameters, selected assets, preview,
package validation, installer and native-check callers against the AI-slop checks.
No remaining actionable findings in this bounded source/package slice.

Resolved during review:
- Shared installer accepted the new manifest but still targeted Mega-City One.
  It now refuses Brit-Cit before any fixture writes; observed refusal left an empty fixture.
- Qt cannot render the selected lion SVG filters. Rasterise that existing vector
  composition with native librsvg at build time; retain the original source.
  Palette edits still rebuild the image, without reinterpreting its geometry.
- Login geometry and its clipped eagle image were specific to the eagle artwork.
  Adapt only placement/scale and the small emblem; reuse shared form behaviour.
- Shared preview/browser display names now receive the selected theme name.
- Output/source overlap and changed login anchors fail before publication.

Final focused package/regression tests: 5 passed. Earlier full suite: 50 passed,
before the final raster/installer refinements. Native Qt login: 3 passed. Native
lock view reported submit/clear and disabled guard pass, no PAM loaded. Reviewed
the captured login and lock images. Lock view uses current host shell colours,
not an isolated Brit-Cit palette, so this is layout evidence only. No live theme
activation, real authentication, variant lifecycle or public installation proof.

Connected-profile follow-up: reviewed variant resolution, old/new owned-edit
transitions, asset wrappers, native-check inputs and the privileged install helper.
The helper accepts only the two known slugs, refuses existing destinations and
selection files, preserves stock files, and never restarts SDDM. The active
profile retains its original recovery baseline; repeated registration checks
baseline asset edits rather than adopting modified data. No additional actionable
findings in this bounded change. Final full regression run: 51 passed.
