import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { checkPackage, hash } from './build-theme.mjs';

import { exists, rejectSymlinks } from './user-files.mjs';
export { exists, rejectSymlinks } from './user-files.mjs';

export function fixtureLocations(home) {
  if (!home) throw new Error('An explicit --target-home is required');
  home = path.resolve(home);
  rejectSymlinks(home);
  if (home === path.resolve(os.homedir())) throw new Error('Live HOME installation is not enabled; use a fixture HOME');
  if (!fs.statSync(home).isDirectory()) throw new Error('Target HOME must be an existing directory');
  const destination = path.join(home, '.config/omarchy/themes/mega-city-one');
  const state = path.join(home, '.local/state/thememe/mega-city-one');
  rejectSymlinks(destination);
  rejectSymlinks(state);
  return { destination, state, receipt: path.join(state, 'receipt.json'), backup: path.join(state, 'previous-theme') };
}
function snapshot(root, relative = '') {
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error('Theme root cannot be a symlink');
  const entries = [];
  for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    const name = relative ? relative + '/' + entry.name : entry.name;
    const absolute = path.join(root, name), mode = fs.statSync(absolute).mode & 0o777;
    if (entry.isSymbolicLink()) throw new Error(`Theme symlink is not allowed: ${name}`);
    if (entry.isDirectory()) entries.push({ path: name, type: 'directory', mode }, ...snapshot(root, name));
    else if (entry.isFile()) entries.push({ path: name, type: 'file', mode, sha256: hash(fs.readFileSync(absolute)) });
    else throw new Error(`Unsupported theme entry: ${name}`);
  }
  return entries;
}
function readReceipt(l) {
  const receipt = JSON.parse(fs.readFileSync(l.receipt));
  if (receipt.schemaVersion !== 1 || receipt.name !== 'mega-city-one' || !Array.isArray(receipt.installed)) throw new Error('Invalid installation receipt');
  if (JSON.stringify(snapshot(l.destination)) !== JSON.stringify(receipt.installed)) throw new Error('Installed theme has user changes; refusing to overwrite or remove');
  if (receipt.hadPrevious && (!exists(l.backup) || JSON.stringify(snapshot(l.backup)) !== JSON.stringify(receipt.previous))) throw new Error('Previous theme backup has changed or is missing');
  return receipt;
}
function writeReceipt(l, receipt) {
  const temporary = path.join(l.state, 'receipt.next.json');
  let created = false;
  try {
    fs.writeFileSync(temporary, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
    created = true;
    fs.renameSync(temporary, l.receipt);
  } finally {
    if (created) fs.rmSync(temporary, { force: true });
  }
}
function updateTheme(packageRoot, l, previous, packageHash) {
  const stage = path.join(l.state, 'updated-theme'), rollback = path.join(l.state, 'update-rollback');
  if (exists(stage) || exists(rollback)) throw new Error('Interrupted update state exists; preserve it for recovery');
  let moved = false, installed = false;
  try {
    fs.cpSync(path.join(packageRoot, 'theme'), stage, { recursive: true });
    fs.renameSync(l.destination, rollback); moved = true;
    fs.renameSync(stage, l.destination); installed = true;
    writeReceipt(l, { ...previous, packageHash, installed: snapshot(l.destination) });
  } catch (error) {
    if (installed) fs.rmSync(l.destination, { recursive: true });
    if (moved) fs.renameSync(rollback, l.destination);
    fs.rmSync(stage, { recursive: true, force: true });
    throw error;
  }
  fs.rmSync(rollback, { recursive: true });
}
export function installTheme(packageRoot, home, dryRun = false) {
  checkPackage(packageRoot);
  const l = fixtureLocations(home);
  const packageHash = hash(fs.readFileSync(path.join(packageRoot, 'manifest.json')));
  if (exists(l.receipt)) {
    const previous = readReceipt(l);
    if (previous.packageHash === packageHash) return { action: 'unchanged', destination: l.destination, dryRun };
    if (exists(path.join(path.dirname(l.state), 'mega-city-one-settings'))) throw new Error('Restore font settings before updating the package');
    if (!dryRun) updateTheme(packageRoot, l, previous, packageHash);
    return { action: dryRun ? 'update' : 'updated', destination: l.destination, dryRun };
  }
  if (exists(l.state)) throw new Error('Installation state already exists without a receipt; preserve it for recovery');
  if (exists(l.destination)) snapshot(l.destination);
  if (dryRun) return { action: 'install', destination: l.destination, dryRun: true };
  fs.mkdirSync(l.state, { recursive: true });
  const stage = path.join(l.state, 'staged-theme');
  let backedUp = false, installed = false;
  try {
    fs.cpSync(path.join(packageRoot, 'theme'), stage, { recursive: true });
    fs.mkdirSync(path.dirname(l.destination), { recursive: true });
    if (exists(l.destination)) { fs.renameSync(l.destination, l.backup); backedUp = true; }
    fs.renameSync(stage, l.destination);
    installed = true;
    const receipt = { schemaVersion: 1, name: 'mega-city-one', packageHash, hadPrevious: backedUp, installed: snapshot(l.destination), previous: backedUp ? snapshot(l.backup) : null };
    writeReceipt(l, receipt);
  } catch (error) {
    if (installed) fs.rmSync(l.destination, { recursive: true });
    if (backedUp) fs.renameSync(l.backup, l.destination);
    fs.rmSync(l.state, { recursive: true, force: true });
    throw error;
  }
  return { action: 'installed', destination: l.destination, dryRun: false };
}
export function removeTheme(home, dryRun = false) {
  const l = fixtureLocations(home);
  if (exists(path.join(path.dirname(l.state), 'mega-city-one-settings'))) throw new Error('Restore font settings before removing their package');
  if (!exists(l.receipt)) {
    if (exists(l.state)) throw new Error('Installation state has no receipt; preserve it for recovery');
    return { action: 'absent', dryRun };
  }
  const receipt = readReceipt(l);
  const allowed = new Set(['receipt.json', ...(receipt.hadPrevious ? ['previous-theme'] : [])]);
  for (const name of fs.readdirSync(l.state)) {
    if (!allowed.has(name)) throw new Error(`Unrecognised installation state: ${name}; preserve it for recovery`);
  }
  if (dryRun) return { action: 'remove', destination: l.destination, dryRun: true };
  const removed = path.join(l.state, 'removed-theme');
  fs.renameSync(l.destination, removed);
  try {
    if (receipt.hadPrevious) fs.renameSync(l.backup, l.destination);
  } catch (error) {
    fs.renameSync(removed, l.destination);
    throw error;
  }
  fs.rmSync(l.state, { recursive: true });
  return { action: 'removed', destination: l.destination, dryRun: false };
}
