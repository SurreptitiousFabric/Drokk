import { replaceFile } from './user-files.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { hash } from './build-theme.mjs';
import { installTheme, fixtureLocations, exists, rejectSymlinks } from './install-theme.mjs';

const ownedPaths = ['.config/foot/foot.ini', '.config/fontconfig/conf.d/99-mega-city-one.conf'];
function locations(home) {
  const theme = fixtureLocations(home);
  const state = path.join(path.dirname(theme.state), 'mega-city-one-settings');
  rejectSymlinks(state);
  const receipt = path.join(state, 'receipt.json');
  rejectSymlinks(receipt);
  const files = ownedPaths.map(p => path.join(path.resolve(home), p));
  files.forEach(rejectSymlinks);
  return { ...theme, state, files, receipt };
}
function footFonts(text, font) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const keys = new Map(['font', 'font-bold', 'font-italic', 'font-bold-italic'].map(key => [key, font]));
  const lines = text ? text.split(/\r?\n/) : ['[main]'];
  if (lines.at(-1) === '') lines.pop();
  let main = true, flushed = false;
  const output = [];
  const flush = () => { if (!flushed) { for (const [key,value] of keys) output.push(`${key}=${value}`); flushed = true; } };
  for (const line of lines) {
    const section = line.match(/^\s*\[([^\]]+)\]/);
    if (section) {
      if (main && section[1] !== 'main') flush();
      main = section[1] === 'main';
    }
    const assignment = main && line.match(/^\s*(font(?:-bold-italic|-bold|-italic)?)\s*=/);
    if (assignment) { output.push(`${assignment[1]}=${font}`); keys.delete(assignment[1]); }
    else output.push(line);
  }
  if (!flushed) {
    if (!main) output.push('', '[main]');
    flush();
  }
  return output.join(eol) + eol;
}
function readState(l) {
  const receipt = JSON.parse(fs.readFileSync(l.receipt));
  if (receipt.schemaVersion !== 1 || receipt.name !== 'mega-city-one-settings' || receipt.files?.length !== ownedPaths.length) throw new Error('Invalid settings receipt');
  const expected = new Set(['receipt.json']);
  for (const [i, entry] of receipt.files.entries()) {
    if (entry.path !== ownedPaths[i]) throw new Error('Invalid settings path');
    const current = fs.readFileSync(l.files[i]);
    if (hash(current) !== entry.installedHash || (fs.statSync(l.files[i]).mode & 0o777) !== entry.mode) throw new Error(`Configured file has user changes: ${entry.path}`);
    if (entry.existed) {
      const backup = path.join(l.state, 'backup-' + i);
      rejectSymlinks(backup);
      if (hash(fs.readFileSync(backup)) !== entry.previousHash) throw new Error('Settings backup has changed');
      expected.add('backup-' + i);
    }
  }
  for (const name of fs.readdirSync(l.state)) if (!expected.has(name)) throw new Error('Unrecognised settings recovery file');
  return receipt;
}
export function configureTheme(packageRoot, home, dryRun = false) {
  const installed = installTheme(packageRoot, home, true);
  if (installed.action !== 'unchanged') throw new Error('Install this package before configuring its fonts');
  const l = locations(home);
  if (exists(l.receipt)) { readState(l); return { action: 'settings-unchanged', dryRun }; }
  if (exists(l.state)) throw new Error('Incomplete settings state exists; preserve it for recovery');
  const typography = JSON.parse(fs.readFileSync(path.join(l.destination, 'typography.json')));
  const font = `${typography.roles.mono.family}:pixelsize=${typography.sizes.terminalPx}`;
  const directory = path.join(l.destination, 'fonts').replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  const previous = l.files.map(file => exists(file) ? fs.readFileSync(file) : null);
  const next = [Buffer.from(footFonts(previous[0]?.toString('utf8') ?? '', font)), Buffer.from(`<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${directory}</dir></fontconfig>\n`)];
  const entries = l.files.map((file, i) => ({ path: ownedPaths[i], existed: previous[i] !== null, previousHash: previous[i] ? hash(previous[i]) : null, installedHash: hash(next[i]), mode: exists(file) ? fs.statSync(file).mode & 0o777 : 0o600 }));
  if (dryRun) return { action: 'configure-fonts', files: ownedPaths, dryRun: true };
  fs.mkdirSync(l.state, { recursive: true, mode: 0o700 });
  const applied = [];
  try {
    for (let i = 0; i < l.files.length; i++) if (previous[i]) fs.writeFileSync(path.join(l.state, 'backup-' + i), previous[i], { mode: 0o600, flag: 'wx' });
    for (let i = 0; i < l.files.length; i++) { replaceFile(l.files[i], next[i], entries[i].mode); applied.push(i); }
    replaceFile(l.receipt, JSON.stringify({ schemaVersion: 1, name: 'mega-city-one-settings', files: entries }, null, 2) + '\n');
  } catch (error) {
    for (const i of applied.reverse()) {
      if (previous[i]) replaceFile(l.files[i], previous[i], entries[i].mode);
      else fs.unlinkSync(l.files[i]);
    }
    fs.rmSync(l.state, { recursive: true });
    throw error;
  }
  return { action: 'fonts-configured', files: ownedPaths, dryRun: false };
}
export function unconfigureTheme(home, dryRun = false) {
  const l = locations(home);
  if (!exists(l.receipt)) {
    if (exists(l.state)) throw new Error('Incomplete settings state exists; preserve it for recovery');
    return { action: 'settings-absent', dryRun };
  }
  const receipt = readState(l);
  if (dryRun) return { action: 'restore-font-settings', files: ownedPaths, dryRun: true };
  const configured = l.files.map(file => fs.readFileSync(file));
  const restored = [];
  try {
    for (const [i, entry] of receipt.files.entries()) {
      if (entry.existed) replaceFile(l.files[i], fs.readFileSync(path.join(l.state, 'backup-' + i)), entry.mode);
      else fs.unlinkSync(l.files[i]);
      restored.push(i);
    }
  } catch (error) {
    for (const i of restored.reverse()) replaceFile(l.files[i], configured[i], receipt.files[i].mode);
    throw error;
  }
  fs.rmSync(l.state, { recursive: true });
  return { action: 'font-settings-restored', dryRun: false };
}
