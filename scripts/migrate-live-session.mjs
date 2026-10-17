// One-time adoption of this development installation, using its recorded originals.
// Writes a prepared profile only; no desktop settings or hook are changed here.
import fs from 'node:fs';
import path from 'node:path';
import { createSessionProfile } from './session-profile.mjs';
import { exists, rejectSymlinks } from './user-files.mjs';
const home = process.env.HOME;
const recovery = path.resolve(process.argv[2] ?? '');
const destination = path.resolve(process.argv[3] ?? '');
if (process.argv.length !== 4) throw new Error('Usage: migrate-live-session.mjs <font-recovery-directory> <new-profile-directory>');
rejectSymlinks(destination);
if (exists(destination)) throw new Error('Prepared directory already exists');
const original = {};
const saved = JSON.parse(fs.readFileSync(path.join(recovery, 'font-settings.json')));
for (const entry of saved.files) {
  original[entry.path] = entry.existed ? fs.readFileSync(path.join(recovery, 'font-settings', entry.path), 'utf8') : null;
}
original['.config/yazi/theme.toml'] = null;
original['.config/gtk-3.0/gtk.css'] = null;
original['.config/gtk-4.0/gtk.css'] = null;
const theme = path.resolve('dist/mega-city-one/theme');
const profile = createSessionProfile(home, theme, original, path.join(home, '.config/omarchy/themes/mega-city-one'));
const footPath = '.config/foot/foot.ini';
const fonts = text => [...text.matchAll(/^font(?:-bold-italic|-bold|-italic)?=.*\n/gm)].map(m => m[0]).join('');
const footBefore = fonts(original[footPath]), footAfter = fonts(fs.readFileSync(path.join(home, footPath), 'utf8'));
if (!fs.readFileSync(path.join(home, footPath), 'utf8').includes(footAfter)) throw new Error('Non-contiguous legacy Foot fonts');
profile.edits = profile.edits.filter(e => e.path !== footPath && e.path !== '.config/fontconfig/conf.d/99-drokk.conf');
profile.edits.push({ path: footPath, before: footBefore, after: footAfter });
const fontconfig = '.config/fontconfig/fonts.conf';
if (original[fontconfig] !== null) throw new Error('Legacy fontconfig baseline must be absent');
profile.edits.push({ path: fontconfig, before: '', after: fs.readFileSync(path.join(home, fontconfig), 'utf8'), beforeAbsent: true, wholeFile: true });
const patches = JSON.parse(fs.readFileSync(new URL('../theme/mega-city-one/source/plugin-colour-patches.json', import.meta.url)));
for (const patch of patches) {
  const file = fs.realpathSync(path.join(home, '.config/omarchy/plugins', patch.id, patch.file));
  const relative = path.relative(home, file);
  if (relative.startsWith('../')) throw new Error('Legacy plugin resolves outside HOME');
  for (const [before, after] of patch.changes) profile.edits.push({ path: relative, before, after });
}
for (const edit of profile.edits) {
  const file = path.join(home, edit.path); rejectSymlinks(file);
  if (!exists(file) || !fs.readFileSync(file, 'utf8').includes(edit.after)) throw new Error('Legacy fragment no longer matches: ' + edit.path);
}
const savedSettings = JSON.parse(fs.readFileSync(path.join(home, '.local/state/thememe/live-apps/original-settings.json')));
const settingsBefore = Object.fromEntries(Object.keys(profile.settings).map(key => [key, savedSettings[key]]));
// This explicitly restores the normal opaque bar; no original shell snapshot exists.
const state = { active: true, settingsBefore, transparentBefore: false, theme: 'mega-city-one', preserved: [] };
fs.mkdirSync(destination, { recursive: true, mode: 0o700 });
for (const [name, value] of Object.entries({profile, session: state})) fs.writeFileSync(path.join(destination, name + '.json'), JSON.stringify(value, null, 2) + '\n', {mode: 0o600});
console.log(`Prepared ${profile.edits.length} owned appearance fragments; no live settings changed`);
