#pragma once
#include <hyprland/src/version.h>
#include <string_view>

static_assert(std::string_view{GIT_COMMIT_HASH} == "5c9377c15f85c50648f35ca5a213754f95b93ca0",
              "Unsupported Hyprland commit: Drokk card currently supports 0.56.1; wait for a tested card update.");
