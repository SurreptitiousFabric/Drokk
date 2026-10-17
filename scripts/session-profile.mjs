import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { exists, rejectSymlinks } from './user-files.mjs';

// Added only by explicit installation of the native card companion.
export function windowCardEdit(home, binaryName = 'drokk-card.so') {
  const plugin = JSON.stringify(path.isAbsolute(binaryName) ? binaryName : path.join(home, '.local/share/drokk/window-card', binaryName));
  return { path: '.config/hypr/looknfeel.lua', before: '', after:
    `\n-- BEGIN Drokk window card\ndo\n  local path = ${plugin}\n  local file = io.open(path, "rb")\n  if file then\n    file:close()\n    pcall(hl.plugin.load, path)\n    if hl.plugin.drokk_card then\n      hl.config({ plugin = { drokk_card = { enabled = true } } })\n      hl.bind("SUPER + ALT + I", function() if hl.plugin.drokk_card then hl.plugin.drokk_card.toggle() end end, { description = "Toggle Drokk window card" })\n    end\n  end\nend\n-- END Drokk window card\n` };
}

export function shellFontConfig(typography) {
  const xml = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  return `<?xml version="1.0"?>\n<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n<fontconfig><match target="pattern"><test name="family" qual="any"><string>monospace</string></test><edit name="family" mode="prepend_first" binding="strong"><string>${xml(typography.roles.shell.family)}</string><string>${xml(typography.roles.icons.family)}</string></edit></match></fontconfig>\n`;
}
// Capture only appearance fragments. Optional personal-plugin patches are never
// part of the portable profile; the legacy migration supplies them explicitly.
export function createSessionProfile(home, theme, original = {}, installedTheme = path.join(home, '.config/omarchy/themes/drokk')) {
  const typography = JSON.parse(fs.readFileSync(path.join(theme, 'typography.json')));
  const family = typography.roles.mono.family;
  const edits = [];
  const read = relative => {
    const file = path.join(home, relative); rejectSymlinks(file);
    return Object.hasOwn(original, relative) ? original[relative] : exists(file) ? fs.readFileSync(file, 'utf8') : null;
  };
  const add = (relative, before, after, extra = {}) => {
    if (before !== after) edits.push({ path: relative, before, after, ...extra });
  };
  const lines = (relative, expression, replacement) => {
    const text = read(relative);
    if (text === null) return;
    for (const match of text.matchAll(expression)) add(relative, match[0], replacement(match[0]));
  };
  lines('.config/foot/foot.ini', /^font(?:-bold-italic|-bold|-italic)?=.*\n/gm,
    line => line.slice(0, line.indexOf('=')) + '=' + family + ':pixelsize=' + typography.sizes.terminalPx + '\n');
  lines('.config/ghostty/config', /^font-family\s*=.*\n/gm, () => `font-family = "${family}"\n`);
  lines('.config/kitty/kitty.conf', /^font_family\s+.*\n/gm, () => `font_family ${family}\n`);
  lines('.config/alacritty/alacritty.toml', /^(?:normal|bold|italic)\s*=\s*\{[^\n]*family[^\n]*\}\n/gm,
    line => `${line.split('=')[0].trim()} = { family = "${family}" }\n`);
  for (const version of ['3.0', '4.0']) {
    const relative = `.config/gtk-${version}/gtk.css`;
    const url = pathToFileURL(path.join(installedTheme, `gtk-${version}.css`));
    add(relative, '', `/* BEGIN Mega-City One */\n@import url("${url}");\n/* END Mega-City One */\n`, { beforeAbsent: read(relative) === null });
  }
  add('.config/hypr/looknfeel.lua', '', '\n-- BEGIN Mega-City One cursor\nhl.env("XCURSOR_THEME", "Mega-City-One-Cursor")\n-- END Mega-City One cursor\n');
  const fontconfig = '.config/fontconfig/conf.d/99-drokk.conf';
  add(fontconfig, read(fontconfig) ?? '', shellFontConfig(typography), { wholeFile: true, beforeAbsent: read(fontconfig) === null });
  const yazi = '.config/yazi/theme.toml';
  add(yazi, read(yazi) ?? '', fs.readFileSync(path.join(theme, 'yazi-theme.toml'), 'utf8'), { wholeFile: true, beforeAbsent: read(yazi) === null });
  return { companions: ['menu', 'workspaces', 'audio', 'network', 'bluetooth', 'power', 'lock', 'notifications'].map(k => 'megacity.' + k), transparentBar: true, edits, settings: {
    'icon-theme': "'Mega-City-One'", 'cursor-theme': "'Mega-City-One-Cursor'", 'cursor-size': '24',
    'font-name': `'${typography.roles.interface.family} ${typography.sizes.interfacePx * 0.75}'`,
  } };
}
