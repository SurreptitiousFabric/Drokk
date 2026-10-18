import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkPackage } from './build-theme.mjs';

const root = path.resolve(process.argv[2] ?? 'dist/mega-city-one');
const manifest = checkPackage(root);
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'mega-city-login-'));
try {
  fs.cpSync(path.join(root, 'sddm/' + manifest.name), temporary, { recursive: true });
  fs.copyFileSync(path.join(import.meta.dirname, '../tests/login.qml'), path.join(temporary, 'tst_login.qml'));
  const result = spawnSync('/usr/lib/qt6/bin/qmltestrunner', ['-platform', 'offscreen', '-input', temporary], {
    encoding: 'utf8', timeout: 5000, env: { ...process.env, QT_QUICK_BACKEND: 'software' },
  });
  process.stdout.write(result.stdout ?? ''); process.stderr.write(result.stderr ?? '');
  if (result.status !== 0) throw new Error(`Native login form check failed: ${result.error?.message ?? result.status}`);
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
