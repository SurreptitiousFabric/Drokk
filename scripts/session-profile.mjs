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
  return { companions: ['menu', 'workspaces', 'audio', 'network', 'bluetooth', 'power', 'lock', 'notifications'].map(k => 'megacity.' + k), transparentBar: true, barTransparent: false, edits, settings: {
    'icon-theme': "'Mega-City-One'", 'cursor-theme': "'Mega-City-One-Cursor'", 'cursor-size': '24',
    'font-name': `'${typography.roles.interface.family} ${typography.sizes.interfacePx * 0.75}'`,
  } };
}

export function withVariantProfile(profile, basePackage, variantPackage) {
  const id = JSON.parse(fs.readFileSync(path.join(variantPackage, 'manifest.json'))).name;
  if (!['brit-cit', 'judge-death'].includes(id)) throw new Error('Unsupported profile variant');
  const next = structuredClone(profile);
  const overrides = [];
  for (const edit of next.edits) {
    if (/^\.config\/gtk-[34]\.0\/gtk\.css$/.test(edit.path)) {
      overrides.push({ ...edit, after: edit.after.replace('/themes/drokk/', '/themes/' + id + '/') });
    } else if (edit.path === '.config/yazi/theme.toml') {
      overrides.push({ ...edit, after: fs.readFileSync(path.join(variantPackage, 'theme/yazi-theme.toml'), 'utf8') });
    }
  }
  for (const [destination, source] of [
    ['megacity.menu/emblem.svg', 'plugins/megacity.menu/emblem.svg'],
    ['megacity.menu/BarWidget.qml', 'plugins/megacity.menu/BarWidget.qml'],
    ['megacity.workspaces/BarWidget.qml', 'plugins/megacity.workspaces/BarWidget.qml'],
    ['megacity.lock/lock-emblem.svg', 'plugins/megacity.lock/lock-emblem.svg'],
  ]) {
    const relative = '.config/omarchy/plugins/' + destination;
    const baseline = fs.readFileSync(path.join(basePackage, source), 'utf8');
    const existing = next.edits.find(edit => edit.path === relative);
    if (existing && (existing.after !== baseline || !existing.wholeFile)) throw new Error('Variant asset registration changed: ' + relative);
    if (!existing) next.edits.push({ path: relative, before: baseline, after: baseline, wholeFile: true });
    overrides.push({ path: relative, before: existing?.before ?? baseline, after: fs.readFileSync(path.join(variantPackage, source), 'utf8'), wholeFile: true });
  }
  next.variants = { ...next.variants, [id]: { edits: overrides, barTransparent: false } };
  return next;
}
