# Bar layout cleanup review

Reviewed changed lifecycle/profile logic against the AI-slop checklist. Uses the
existing session state and rollback transaction, not a second configuration owner.
Only existing clock/weather/update entries move; their properties and personal
widgets remain intact. Conservative conflict detection preserves deliberate user
rearrangement. No actionable findings after fixing the new-widget removal case.

Evidence: ownership RED failed on missing arrangement; GREEN passed restoration,
variant exchange, deliberate moves, failed activation and disable/enable. New
weather-widget preservation RED caught removal; narrowed ownership made it GREEN.
All 60 serial tests passed. Native Lumon → Death → Lumon restored exact layout,
kept wallpaper and returned inactive with no preservation conflicts. No SDDM or
lock/authentication changes. Other users' desktops were not tested.
