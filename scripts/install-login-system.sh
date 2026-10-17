#!/usr/bin/bash
# Install a previously checked package and select it for the next SDDM login.
# No SDDM restart, authentication-policy changes, or replacement of stock files.
set -euo pipefail
if (( EUID != 0 )); then echo 'Administrator privileges required' >&2; exit 1; fi
source_theme=${1:?Expected absolute prepared SDDM theme path}
case "$source_theme" in /*) ;; *) echo 'Source must be absolute' >&2; exit 1 ;; esac
readonly target=/usr/share/sddm/themes/mega-city-one
readonly selection=/etc/sddm.conf.d/99-mega-city-one.conf
if [[ -e $target || -L $target || -e $selection || -L $selection ]]; then
  echo 'Theme or selection already exists; refusing overwrite' >&2; exit 1
fi
if [[ -L $source_theme || -n $(find "$source_theme" -type l -print -quit) ]]; then
  echo 'Refusing source symlinks' >&2; exit 1
fi
for parent in /usr/share/sddm/themes /etc/sddm.conf.d; do
  [[ -d $parent && ! -L $parent ]] || { echo 'Unexpected destination directory' >&2; exit 1; }
done
stage=$(mktemp -d /usr/share/sddm/themes/.mega-city-one.XXXXXX)
selection_stage=''
published=0
complete=0
cleanup() {
  if [[ -n $selection_stage && -f $selection_stage ]]; then unlink "$selection_stage"; fi
  if (( ! complete )); then
    if (( published )); then rm -r -- "$target"; else rm -r -- "$stage"; fi
  fi
}
trap cleanup EXIT
chmod 755 "$stage"
files=(Main.qml LoginForm.qml background.png metadata.desktop theme.conf emblem.svg
  fonts/PlexSans-Variable.ttf fonts/PlexSans-OFL.txt
  fonts/ShureTechMonoNerdFontMono-Regular.ttf fonts/ShureTechMono-OFL.txt)
for file in "${files[@]}"; do
  [[ -f $source_theme/$file ]] || { echo "Missing prepared file: $file" >&2; exit 1; }
  install -D -m 644 -o root -g root "$source_theme/$file" "$stage/$file"
  cmp -- "$source_theme/$file" "$stage/$file"
  runuser -u sddm -- test -r "$stage/$file"
done
mv -T -- "$stage" "$target"
published=1
selection_stage=$(mktemp /etc/sddm.conf.d/.mega-city-one.XXXXXX)
printf '[Theme]\nCurrent=mega-city-one\n' > "$selection_stage"
chmod 644 "$selection_stage"
# Hard link publishes without overwriting a file created since the preflight.
ln -- "$selection_stage" "$selection"
unlink "$selection_stage"
selection_stage=''
complete=1
printf 'Installed and selected Mega-City One. SDDM was not restarted.\n'
