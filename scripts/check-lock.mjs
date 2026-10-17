import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkPackage } from './build-theme.mjs';

const root = path.resolve(process.argv[2] ?? 'dist/mega-city-one');
checkPackage(root);
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'mega-city-lock-view-'));
const capture = path.resolve('harness/evidence/lock-preview.png');
try {
  // Deliberately load the view alone: no lock service, PAM or WlSessionLock.
  for (const name of ['LockView.qml', 'lock-emblem.png']) fs.copyFileSync(path.join(root, 'plugins/megacity.lock', name), path.join(temporary, name));
  for (const name of ['Commons', 'Ui']) fs.symlinkSync('/usr/share/omarchy/shell/' + name, path.join(temporary, name));
  fs.copyFileSync(path.join(import.meta.dirname, '../tests/lock-preview.qml'), path.join(temporary, 'shell.qml'));
  fs.mkdirSync(path.dirname(capture), { recursive: true });
  const result = spawnSync('qs', ['-p', temporary], { encoding: 'utf8', timeout: 7000,
    env: { ...process.env, MEGACITY_PREVIEW_BACKGROUND: path.join(root, 'theme/backgrounds/mega-city-one.png'), MEGACITY_PREVIEW_CAPTURE: capture },
  });
  process.stdout.write(result.stdout ?? ''); process.stderr.write(result.stderr ?? '');
  if (result.status !== 0 || !(result.stdout + result.stderr).includes('LOCK_VIEW_CHECK_PASS')) throw new Error(`Native lock view check failed: ${result.error?.message ?? result.status}`);
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
