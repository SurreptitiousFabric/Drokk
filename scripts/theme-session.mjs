import { exists, rejectSymlinks, replaceFile } from './user-files.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const widgetKinds = ['menu', 'workspaces', 'audio', 'network', 'bluetooth', 'power'];
const serviceKinds = ['lock', 'notifications'];
export function transitionShell(config, active) {
  const next = structuredClone(config);
  for (const entries of Object.values(next.bar?.layout ?? {})) {
    for (const entry of entries) for (const kind of widgetKinds) {
      if (entry.id === (active ? 'omarchy.' : 'megacity.') + kind)
        entry.id = (active ? 'megacity.' : 'omarchy.') + kind;
    }
  }
  next.plugins ??= [];
  for (const kind of serviceKinds) {
    const own = 'megacity.' + kind, stock = 'omarchy.' + kind;
    const enabled = next.plugins.some(p => p.id === own);
    if (active && !(next.disabledPlugins ?? []).includes(own) &&
        (enabled || !(next.disabledPlugins ?? []).includes(stock))) {
      if (!enabled) next.plugins.push({ id: own });
      next.disabledPlugins ??= [];
      if (!next.disabledPlugins.includes(stock)) next.disabledPlugins.push(stock);
    } else if (!active && enabled) {
      next.plugins = next.plugins.filter(p => p.id !== own);
      next.disabledPlugins = (next.disabledPlugins ?? []).filter(id => id !== stock);
    }
  }
  if (!active && next.cloneSourceRestores)
    next.cloneSourceRestores = next.cloneSourceRestores.filter(id => !serviceKinds.some(k => id === 'megacity.' + k));
  return next;
}

export function transitionText(text, edit, active) {
  const from = active ? edit.before : edit.after;
  const to = active ? edit.after : edit.before;
  if (edit.wholeFile) {
    if (text === to) return text;
    if (text !== from) throw new Error('Owned file changed: ' + edit.path);
    return to;
  }
  if (to !== '' && (from === '' || to.includes(from)) && text.split(to).length === 2) return text;
  if (from !== '' && text.split(from).length === 2) return text.replace(from, to);
  if (to !== '' && text.split(to).length === 2) return text;
  if (from === '') return text + to;
  throw new Error('Owned fragment changed: ' + edit.path);
}

// Pure deltas own only our fragments; whole user configuration is never a baseline.
export function applySession(home, theme, settings, enabled, shellLifecycle) {
  const profilePath = path.join(home, '.local/share/drokk/profile.json');
  const statePath = path.join(home, '.local/state/drokk/session.json');
  rejectSymlinks(profilePath); rejectSymlinks(statePath);
  const baseProfile = JSON.parse(fs.readFileSync(profilePath));
  const profileFor = slug => {
    const overrides = baseProfile.variants?.[slug];
    if (!overrides) return baseProfile;
    const edits = baseProfile.edits.map(edit => overrides.edits.find(item => item.path === edit.path) ?? edit);
    return { ...baseProfile, ...overrides, edits };
  };
  const profile = profileFor(theme);
  const previous = exists(statePath) ? JSON.parse(fs.readFileSync(statePath)) : { active: false };
  enabled ??= previous.enabled ?? true;
  let active = enabled && (['drokk', 'mega-city-one'].includes(theme) || Object.hasOwn(baseProfile.variants ?? {}, theme));
  const changes = new Map(), preserved = [];
  if (active) for (const id of profile.companions ?? []) {
    if (![...widgetKinds, ...serviceKinds].some(kind => id === 'megacity.' + kind)) throw new Error('Invalid companion in profile');
    try {
      const manifest = path.join(home, '.config/omarchy/plugins', id, 'manifest.json');
      rejectSymlinks(manifest);
      if (JSON.parse(fs.readFileSync(manifest)).id !== id) throw new Error('Mismatched manifest');
    } catch {
      active = false;
      preserved.push('Companion unavailable: ' + id + '; using stock shell');
    }
  }
  function read(relative) {
    if (path.isAbsolute(relative) || relative.split('/').includes('..')) throw new Error('Unsafe profile path');
    const file = path.join(home, relative); rejectSymlinks(file);
    if (!changes.has(file)) changes.set(file, { file, before: exists(file) ? fs.readFileSync(file, 'utf8') : null,
      after: exists(file) ? fs.readFileSync(file, 'utf8') : null, mode: exists(file) ? fs.statSync(file).mode & 0o777 : 0o600 });
    return changes.get(file);
  }
  const shell = read('.config/omarchy/shell.json');
  const config = JSON.parse(shell.before);
  const next = transitionShell(config, active);
  let transparentBefore = previous.transparentBefore;
  if (profile.transparentBar && (active !== previous.active || (active && theme !== previous.theme)) && next.bar) {
    if (active) {
      if (!previous.active) transparentBefore = next.bar.transparent ?? null;
      next.bar.transparent = profile.barTransparent ?? true;
    }
    else if (next.bar.transparent === (profileFor(previous.theme).barTransparent ?? true)) {
      if (transparentBefore === null) delete next.bar.transparent;
      else if (transparentBefore !== undefined) next.bar.transparent = transparentBefore;
    }
  }
  if (JSON.stringify(config) !== JSON.stringify(next)) shell.after = JSON.stringify(next, null, 2) + '\n';
  const settingChanges = [], settingsBefore = active && !previous.active ? {} : previous.settingsBefore ?? {};
  const variantChanged = active && previous.active && theme !== previous.theme;
  const editPasses = variantChanged ? [[profileFor(previous.theme), false], [profile, true]]
    : active !== previous.active ? [[active ? profile : profileFor(previous.theme), active]] : [];
  for (const [editingProfile, applying] of editPasses) {
    for (const edit of editingProfile.edits) {
      const item = read(edit.path);
      try {
        item.after = transitionText(item.after ?? '', edit, applying);
        if (!applying && edit.beforeAbsent && item.after === '') item.after = null;
      } catch (error) { preserved.push(error.message); }
    }
  }
  for (const [key, desired] of Object.entries(profile.settings)) {
      if (active === previous.active && !(active && key === 'icon-theme')) continue;
      const current = settings.read(key);
      if (active) {
        if (!previous.active) settingsBefore[key] = current;
        if (current !== desired) settingChanges.push({ key, before: current, after: desired });
      } else if (current === desired && settingsBefore[key] !== undefined) {
        let after = settingsBefore[key];
        if (key === 'icon-theme') {
          const icons = path.join(home, '.local/state/omarchy/current/theme/icons.theme');
          after = JSON.stringify(exists(icons) ? fs.readFileSync(icons, 'utf8').trim() : 'Yaru-blue');
        }
        if (current !== after) settingChanges.push({ key, before: current, after });
      }
  }
  const state = read('.local/state/drokk/session.json');
  state.after = JSON.stringify({ active, enabled, settingsBefore, transparentBefore, theme, preserved }, null, 2) + '\n';
  const applied = [], appliedSettings = [];
  const shellFilesChanged=[...changes.values()].some(c=>c.before!==c.after &&
    (c===shell || c.file.startsWith(path.join(home,'.config/omarchy/plugins')+path.sep)));
  // Dynamic QML replacements can race IPC registration. Load the finished files once.
  if(shellFilesChanged) shellLifecycle?.stop();
  let transactionError;
  try {
    // Publish shell configuration last so services see the completed appearance.
    for (const change of [...changes.values()].sort((a, b) => Number(a === shell) - Number(b === shell))) {
      if (change.before === change.after) continue;
      if (change.after === null) fs.unlinkSync(change.file);
      else replaceFile(change.file, change.after, change.mode);
      applied.push(change);
    }
    for (const change of settingChanges) {
      appliedSettings.push(change);
      settings.write(change.key, change.after);
    }
  } catch (error) {
    const recoveryErrors = [];
    for (const change of appliedSettings.reverse()) {
      try { settings.write(change.key, change.before); } catch (failure) { recoveryErrors.push(failure); }
    }
    for (const change of applied.reverse()) {
      try {
        if (change.before === null) fs.unlinkSync(change.file);
        else replaceFile(change.file, change.before, change.mode);
      } catch (failure) { recoveryErrors.push(failure); }
    }
    transactionError=recoveryErrors.length ? new AggregateError([error, ...recoveryErrors], error.message + '; restoration incomplete: ' + recoveryErrors.map(e => e.message).join('; ')) : error;
    throw transactionError;
  } finally {
    if(shellFilesChanged) try { shellLifecycle?.start(); }
    catch(error) {
      if(transactionError) throw new AggregateError([transactionError,error],transactionError.message+'; shell restart failed: '+error.message);
      throw error;
    }
  }
  return { active, changed: applied.length > 0 || appliedSettings.length > 0,
    shellChanged: shell.before !== shell.after, settingKeys: settingChanges.map(s => s.key), preserved };
}

function main() {
  const command = process.argv[2];
  if (!['apply', 'enable', 'disable'].includes(command)) throw new Error('Usage: theme-session.mjs <apply theme-slug|enable|disable>');
  const home = process.env.HOME;
  const current = fs.readFileSync(path.join(home, '.local/state/omarchy/current/theme.name'), 'utf8').trim();
  const theme = command === 'apply' ? process.argv[3] : current;
  if (theme !== current) { console.log('Ignoring superseded theme hook'); return; }
  const run = (command, args) => execFileSync(command, args, { encoding: 'utf8', timeout: 8000 }).trim();
  const lock = JSON.parse(run('omarchy-shell', ['lock', 'status']));
  if (lock.secure || lock.locked || lock.requested || lock.pending || lock.sessionLocked) throw new Error('Refusing service changes while locked');
  const result = applySession(home, theme, {
    read: key => run('gsettings', ['get', 'org.gnome.desktop.interface', key]),
    write: (key, value) => run('gsettings', ['set', 'org.gnome.desktop.interface', key, value]),
  }, command === 'apply' ? undefined : command === 'enable', {
    stop:()=>run('quickshell',['kill','-p',path.join(process.env.OMARCHY_PATH || '/usr/share/omarchy','shell')]),
    start:()=>run('omarchy',['restart','shell']),
  });
  if (result.changed) {
    run('hyprctl', ['reload']);
    if (result.settingKeys.includes('cursor-theme')) {
      const cursor = run('gsettings', ['get', 'org.gnome.desktop.interface', 'cursor-theme']).replace(/^['"]|['"]$/g, '');
      const size = run('gsettings', ['get', 'org.gnome.desktop.interface', 'cursor-size']);
      run('hyprctl', ['setcursor', cursor, size]);
      run('systemctl', ['--user', 'set-environment', 'XCURSOR_THEME=' + cursor]);
    }
  }
  for (const message of result.preserved) console.warn('Drokk: ' + message);
  console.log(JSON.stringify(result));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
