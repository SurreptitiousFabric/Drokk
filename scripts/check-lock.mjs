import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkPackage } from './build-theme.mjs';

const root = path.resolve(process.argv[2] ?? 'dist/mega-city-one');
checkPackage(root);
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'mega-city-lock-view-'));
const capture = path.resolve(process.argv[3] ?? 'harness/evidence/lock-preview.png');
try {
  // Deliberately load the view alone: no lock service, PAM or WlSessionLock.
  for (const name of ['LockView.qml', 'lock-emblem.png', 'lock-emblem.svg']) fs.copyFileSync(path.join(root, 'plugins/megacity.lock', name), path.join(temporary, name));
  for (const name of ['Commons', 'Ui']) fs.symlinkSync('/usr/share/omarchy/shell/' + name, path.join(temporary, name));
  fs.copyFileSync(path.join(import.meta.dirname, '../tests/lock-preview.qml'), path.join(temporary, 'shell.qml'));
  fs.mkdirSync(path.dirname(capture), { recursive: true });
  const fixtureHome = path.join(temporary, 'home');
  const themePath = path.join(fixtureHome, '.local/state/omarchy/current/theme');
  fs.mkdirSync(themePath, { recursive: true });
  for (const name of ['colors.toml', 'shell.toml']) fs.copyFileSync(path.join(root, 'theme', name), path.join(themePath, name));
  const fontSource = path.join(process.env.HOME, '.config/fontconfig/fonts.conf');
  if (fs.existsSync(fontSource)) {
    const fontTarget = path.join(fixtureHome, '.config/fontconfig/fonts.conf');
    fs.mkdirSync(path.dirname(fontTarget), { recursive: true });
    fs.copyFileSync(fontSource, fontTarget);
  }
  const result = spawnSync('qs', ['-p', temporary], { encoding: 'utf8', timeout: 7000,
    env: { ...process.env, HOME: fixtureHome, USER: "Judge", XDG_CACHE_HOME: path.join(temporary, "cache"), MEGACITY_PREVIEW_BACKGROUND: path.join(root, 'theme/backgrounds/mega-city-one.png'), MEGACITY_PREVIEW_CAPTURE: capture },
  });
  process.stdout.write(result.stdout ?? ''); process.stderr.write(result.stderr ?? '');
  if (result.status !== 0 || !(result.stdout + result.stderr).includes('LOCK_VIEW_CHECK_PASS')) throw new Error(`Native lock view check failed: ${result.error?.message ?? result.status}`);
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
