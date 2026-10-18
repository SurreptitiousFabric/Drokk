import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { previewTheme } from './preview-theme.mjs';
import { terminalTheme } from './terminal-theme.mjs';
import { desktopTheme } from './desktop-theme.mjs';
import { barPlugins } from './bar-plugins.mjs';
import { desktopAssets } from './desktop-assets.mjs';
import { applicationTheme } from './application-theme.mjs';
import { notificationPlugin } from './notification-plugin.mjs';
import { renderTemplate } from './render-template.mjs';
import { lockPluginFiles } from './lock-plugin.mjs';
import { menuPluginFiles } from './menu-plugin.mjs';

export const sourceDirectory = path.resolve(import.meta.dirname, '../theme/mega-city-one/source');
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');

export function resolveModel(source) {
  const model = JSON.parse(fs.readFileSync(path.join(source, 'palette.json')));
  const schema = JSON.parse(fs.readFileSync(path.join(source, 'tokens.json')));
  for (const [group, label] of [['colors', 'colour'], ['alpha', 'alpha']]) {
    for (const id of Object.keys(model[group])) if (!schema[group].includes(id)) throw new Error(`Unsupported ${label} token: ${id}`);
    for (const id of schema[group]) if (!(id in model[group])) throw new Error(`Missing ${label} token: ${id}`);
  }
  const colors = {};
  function resolve(id, trail = []) {
    if (trail.includes(id)) throw new Error(`Circular colour alias: ${[...trail, id].join(' -> ')}`);
    const value = model.colors[id];
    if (typeof value !== 'string') throw new Error(`Unknown colour: ${id}`);
    if (value.startsWith('$')) return resolve(value.slice(1), [...trail, id]);
    if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`Invalid colour: ${id}`);
    return value.toUpperCase();
  }
  for (const id of Object.keys(model.colors)) colors[id] = resolve(id);
  for (const [id, value] of Object.entries(model.alpha)) {
    if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error(`Invalid alpha: ${id}`);
  }
  return { colors, alpha: model.alpha };
}

export function buildTheme(source, out, themeName = 'mega-city-one') {
  if (!['mega-city-one', 'brit-cit', 'judge-death'].includes(themeName)) throw new Error('Unsupported theme identity');
  source = path.resolve(source);
  out = path.resolve(out);
  if (out === source || out.startsWith(source + path.sep) || source.startsWith(out + path.sep)) {
    throw new Error('Build output must not overlap the source directory');
  }
  const displayName = { 'mega-city-one': 'Mega-City One', 'brit-cit': 'Brit-Cit', 'judge-death': 'Judge Death' }[themeName];
  const model = resolveModel(source);
  const files = new Map();
  const add = (name, value) => files.set(name, Buffer.isBuffer(value) ? value : Buffer.from(value));
  const colors = Object.entries(model.colors).filter(([id]) => !id.includes('.'));
  add('theme/colors.toml', 'mode = "dark"\n' + colors.map(([id, value]) => `${id} = "${value}"`).join('\n') + '\n');
  add('theme/plugin-colour-patches.json', fs.readFileSync(path.join(source, 'plugin-colour-patches.json')));
  const sections = new Map();
  const typography = JSON.parse(fs.readFileSync(path.join(source, 'typography.json')));
  for (const [id, value] of [...Object.entries(model.colors), ...Object.entries(model.alpha)]) {
    if (!id.startsWith('shell.')) continue;
    const [, section, key] = id.split('.');
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section).push(`${key} = ${JSON.stringify(value)}`);
  }
  const shellSettings = JSON.parse(fs.readFileSync(path.join(source, 'shell-settings.json')));
  for (const [section, settings] of Object.entries(shellSettings)) {
    if (!sections.has(section)) sections.set(section, []);
    for (const [key, setting] of Object.entries(settings)) {
      const value = typeof setting === 'string' && setting.startsWith('$size.') ? typography.sizes[setting.slice(6)] : setting;
      if (value === undefined) throw new Error(`Unknown typography size: ${setting}`);
      sections.get(section).push(`${key} = ${JSON.stringify(value)}`);
    }
  }
  add('theme/shell.toml', [...sections].map(([name, lines]) => `[${name}]\n${lines.join('\n')}`).join('\n\n') + '\n');
  for (const name of ['emblem', 'folder']) {
    const fragment = fs.readFileSync(path.join(source, 'assets', `${name}.source.svg`), 'utf8');
    const rendered = fragment.replace(/@@color:([^@]+)@@/g, (_, id) => {
      if (!model.colors[id]) throw new Error(`Unknown asset colour: ${id}`);
      return model.colors[id];
    });
    const viewBox = name === 'folder' ? '0 0 64 56' : '0 0 100 100';
    add(`theme/assets/${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${rendered}</svg>\n`);
  }
  const menuPlugin = path.join(source, 'plugins/megacity.menu');
  for (const name of packageFiles(menuPlugin)) add('plugins/megacity.menu/' + name, fs.readFileSync(path.join(menuPlugin, name)));
  add('plugins/megacity.menu/emblem.svg', files.get('theme/assets/emblem.svg'));
  add('plugins/megacity.notifications/manifest.json', fs.readFileSync(path.join(source, 'plugins/megacity.notifications/manifest.json')));
  for (const [name, value] of Object.entries(notificationPlugin(source, model, typography))) add('plugins/megacity.notifications/' + name, value);
  for (const [name, value] of Object.entries(menuPluginFiles(source))) add('plugins/megacity.menu/' + name, value);
  for (const name of packageFiles(path.join(source, 'sddm'))) add('sddm/' + themeName + '/' + name, renderTemplate(fs.readFileSync(path.join(source, 'sddm', name), 'utf8'), model, typography));
  add('sddm/' + themeName + '/background.png', fs.readFileSync(path.join(source, 'assets/login-reference.png')));
  add('sddm/' + themeName + '/emblem.svg', files.get('theme/assets/emblem.svg'));
  for (const name of ['PlexSans-Variable.ttf', 'ShureTechMonoNerdFontMono-Regular.ttf', 'PlexSans-OFL.txt', 'ShureTechMono-OFL.txt']) {
    if (fs.existsSync(path.join(source, 'fonts', name))) add('sddm/' + themeName + '/fonts/' + name, fs.readFileSync(path.join(source, 'fonts', name)));
  }
  for (const [name, value] of Object.entries(lockPluginFiles(source))) add('plugins/megacity.lock/' + name, value);
  for (const [name, value] of Object.entries(desktopAssets(model, files.get('theme/assets/folder.svg'), JSON.parse(fs.readFileSync(path.join(source, 'assets/symbols.json')))))) add('theme/' + name, value);
  for (const [name, value] of Object.entries(barPlugins(source))) add(name, value);
  for (const name of packageFiles(path.join(source, 'plugins/megacity.workspaces'))) add('plugins/megacity.workspaces/' + name, fs.readFileSync(path.join(source, 'plugins/megacity.workspaces', name)));
  add('theme/backgrounds/mega-city-one.png', fs.readFileSync(path.join(source, 'assets/wallpaper.png')));
  for (const name of packageFiles(path.join(source, 'assets/backgrounds'))) add('theme/backgrounds/' + name, fs.readFileSync(path.join(source, 'assets/backgrounds', name)));
  add('preview/model.json', JSON.stringify(model, null, 2) + '\n');
  for (const [name, value] of Object.entries(applicationTheme(model, typography, displayName))) add('theme/' + name, value);
  const effects = JSON.parse(fs.readFileSync(path.join(source, 'effects.json')));
  if (!Number.isInteger(effects.backdropBlurPx) || effects.backdropBlurPx < 0 || effects.backdropBlurPx > 64) throw new Error('Invalid backdrop blur size');
  if (!Number.isFinite(effects.borderPulseSpeed) || effects.borderPulseSpeed <= 0 || effects.borderPulseSpeed > 100) throw new Error('Invalid border pulse speed');
  for (const [name, value] of Object.entries(desktopTheme(model, typography, effects))) add('theme/' + name, value);
  for (const [name, value] of Object.entries(terminalTheme(model, typography))) add('theme/' + name, value);
  add('theme/typography.json', JSON.stringify(typography, null, 2) + '\n');
  for (const name of packageFiles(path.join(source, 'fonts'))) {
    add('theme/fonts/' + name, fs.readFileSync(path.join(source, 'fonts', name)));
  }
  add('preview/index.html', previewTheme(model, typography, displayName));
  const coverage = {};
  for (const id of [...Object.keys(model.colors), ...Object.keys(model.alpha)]) {
    coverage[id] = id.startsWith('shell.') ? 'native shell configuration; runtime unverified'
      : !id.includes('.') ? 'native palette; runtime unverified'
      : id === 'terminal.cursor' || id === 'effects.terminal-background-alpha' ? 'terminal configuration; runtime unverified'
      : id.startsWith('gtk.') ? 'GTK3/GTK4 application stylesheet; adoption and appearance pending'
      : id.startsWith('qt.') ? 'Qt Widgets stylesheet; adoption and native validation pending'
      : ['browser.toolbar', 'browser.address'].includes(id) ? 'Chromium theme extension; browser adoption pending'
      : id.startsWith('editor.') ? 'native Neovim configuration; runtime unverified'
      : id.startsWith('monitor.') ? 'native btop configuration; runtime unverified'
      : ['art.eagle', 'art.folder'].includes(id) ? 'shared asset'
      : 'preview-only; runtime adapter pending';
  }
  add('preview/coverage.json', JSON.stringify(coverage, null, 2) + '\n');
  const manifest = {
    schemaVersion: 1,
    name: themeName,
    scope: 'Native palette/shell, terminal, Hyprland, btop and Neovim configuration; full desktop and authentication acceptance pending',
    dependencies: [{ package: 'gsfonts', purpose: 'Nimbus Sans Narrow panel faces; not bundled' }, { package: 'aether.nvim', purpose: 'Omarchy Neovim theme integration, v3 API; not bundled' }],
    files: [...files].sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => ({ path: name, sha256: hash(value), bytes: value.length })),
  };
  add('manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  if (fs.existsSync(out)) {
    if (fs.lstatSync(out).isSymbolicLink()) throw new Error('Build output cannot be a symlink');
    if (fs.readdirSync(out).length) checkPackage(out);
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const stage = fs.mkdtempSync(path.join(path.dirname(out), '.mega-city-build-'));
  try {
    for (const [name, bytes] of files) {
      const target = path.join(stage, name);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, bytes);
    }
    if (fs.existsSync(out)) fs.rmSync(out, { recursive: true });
    fs.renameSync(stage, out);
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
  return manifest;
}

export function packageFiles(root, relative = '') {
  const result = [];
  for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    const name = relative ? relative + '/' + entry.name : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Package symlink is not allowed: ${name}`);
    if (entry.isDirectory()) result.push(...packageFiles(root, name));
    else if (entry.isFile()) result.push(name);
    else throw new Error(`Unsupported package entry: ${name}`);
  }
  return result.sort();
}

export function checkPackage(root) {
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error('Package root cannot be a symlink');
  const actual = packageFiles(root);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json')));
  if (manifest.schemaVersion !== 1 || !['mega-city-one', 'brit-cit', 'judge-death'].includes(manifest.name) || !Array.isArray(manifest.files)) throw new Error('Not a Mega-City One package');
  const expected = new Set(['manifest.json']);
  for (const file of manifest.files) {
    if (typeof file.path !== 'string' || !/^(theme\/|preview\/|sddm\/(?:mega-city-one|brit-cit|judge-death)\/|plugins\/megacity\.(menu|notifications|launcher|lock|workspaces|audio|network|bluetooth|power)\/)/.test(file.path) || file.path.split('/').some(part => part === '..' || !part) || file.path.includes('\\')) throw new Error('Unsafe package path');
    if (expected.has(file.path)) throw new Error('Duplicate package path');
    expected.add(file.path);
    const bytes = fs.readFileSync(path.join(root, file.path));
    if (hash(bytes) !== file.sha256 || bytes.length !== file.bytes) throw new Error(`Package file differs: ${file.path}`);
  }
  for (const name of actual) if (!expected.has(name)) throw new Error(`Unexpected package file: ${name}`);
  for (const required of ['theme/colors.toml', 'theme/shell.toml', 'theme/assets/emblem.svg', 'theme/backgrounds/mega-city-one.png', 'preview/index.html', 'preview/model.json']) {
    if (!expected.has(required)) throw new Error(`Missing required package file: ${required}`);
  }
  return manifest;
}
