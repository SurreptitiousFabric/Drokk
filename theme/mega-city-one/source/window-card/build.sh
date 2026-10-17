#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

if [[ $# != 0 ]]; then echo 'Usage: bash build.sh' >&2; exit 2; fi

# hyprpm checks that the output exists, so a failed rebuild must leave no old output.
rm -f -- drokk-window-card.so
card_cxx=${CXX:-g++}
card_compiler=$("$card_cxx" -dumpfullversion)
card_hyprland=$(command -v Hyprland)
card_comment=$(readelf -p .comment "$card_hyprland")
if [[ $card_comment != *" $card_compiler"* ]]; then
  echo 'C++ compiler does not match the installed Hyprland compiler' >&2
  exit 1
fi
card_pkg_flags=$(pkg-config --cflags --libs hyprland pangocairo)
read -r -a card_flags <<< "$card_pkg_flags"
read -r -a card_extra <<< "${CXXFLAGS:-}"
"$card_cxx" -std=c++23 "${card_flags[@]}" "${card_extra[@]}" -I. -fsyntax-only -x c++ - <<'CPP'
#include "Compatibility.hpp"
CPP
card_output=$(mktemp .drokk-card.XXXXXX)
trap 'rm -f -- "$card_output"' EXIT
"$card_cxx" -std=c++23 -O1 -shared -fPIC -fno-gnu-unique -Wall -Wextra -Wno-unused-parameter \
  -I. "${card_extra[@]}" plugin.cpp -o "$card_output" "${card_flags[@]}"
mv -- "$card_output" drokk-window-card.so
