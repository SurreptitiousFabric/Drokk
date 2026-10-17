import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { exists, rejectSymlinks, replaceFile } from './user-files.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
const home = process.env.HOME;
const patches = JSON.parse(fs.readFileSync(new URL('../theme/mega-city-one/source/plugin-colour-patches.json', import.meta.url)));
const state = path.join(home, '.local/state/thememe/live-bar-colours');
const receipt = path.join(state, 'receipt.json');
rejectSymlinks(state);
rejectSymlinks(receipt);
if (exists(receipt) && !fs.statSync(receipt).isFile()) throw new Error('Invalid recovery receipt');
const previous = exists(receipt) ? JSON.parse(fs.readFileSync(receipt, 'utf8')) : [];
if (!Array.isArray(previous) || previous.some(p => !p || typeof p.id !== 'string' || typeof p.file !== 'string' || !/^[a-f0-9]{64}$/.test(p.originalHash) || !/^[a-f0-9]{64}$/.test(p.appliedHash))) throw new Error('Invalid recovery receipt');
const pending = [];
for (const patch of patches) {
  const filename = path.join(home, '.config/omarchy/plugins', patch.id, patch.file);
  rejectSymlinks(filename);
  if (!exists(filename)) continue;
  const original = fs.readFileSync(filename, 'utf8');
  let result = original;
  for (const [before, after] of patch.changes) {
    if (result.includes(after)) continue;
    if (result.split(before).length !== 2) throw new Error('Plugin view changed; refusing patch: ' + patch.id);
    result = result.replace(before, after);
  }
  const backup = path.join(state, patch.id + '.' + patch.file);
  rejectSymlinks(backup);
  if (original !== result && exists(backup)) throw new Error('Recovery copy exists: ' + patch.id);
  const owned = previous.find(p => p.id === patch.id);
  if (owned && (owned.file !== filename || owned.appliedHash !== hash(original))) throw new Error('Plugin has user changes: ' + patch.id);
  if (owned && (!exists(backup) || owned.originalHash !== hash(fs.readFileSync(backup)))) throw new Error('Recovery copy changed or missing: ' + patch.id);
  pending.push({ ...patch, filename, backup, original, result, mode: fs.statSync(filename).mode & 0o777 });
}
const stateExisted = exists(state), createdBackups = [], applied = [];
fs.mkdirSync(state, { recursive: true });
try {
  for (const patch of pending) {
    if (patch.original === patch.result) continue;
    fs.writeFileSync(patch.backup, patch.original, { flag: 'wx', mode: 0o600 });
    createdBackups.push(patch.backup);
    replaceFile(patch.filename, patch.result, patch.mode);
    applied.push(patch);
  }
  const entries = [...previous.filter(p => !pending.some(next => next.id === p.id)), ...pending.map(p => ({ id: p.id, file: p.filename,
    originalHash: hash(exists(p.backup) ? fs.readFileSync(p.backup) : p.original), appliedHash: hash(p.result) }))];
  replaceFile(receipt, JSON.stringify(entries, null, 2) + '\n', 0o600);
} catch (error) {
  // Keep recovery copies if restoration itself fails.
  for (const patch of applied.reverse()) replaceFile(patch.filename, patch.original, patch.mode);
  for (const backup of createdBackups) fs.unlinkSync(backup);
  if (!stateExisted) fs.rmdirSync(state);
  throw error;
}
for (const patch of applied) console.log('Updated icon colour binding: ' + patch.id);
