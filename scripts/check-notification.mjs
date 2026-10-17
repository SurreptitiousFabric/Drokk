import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkPackage } from './build-theme.mjs';

const root = path.resolve(process.argv[2] ?? 'dist/mega-city-one');
checkPackage(root);
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'mega-city-notification-'));
try {
  fs.cpSync(path.join(root, 'plugins/megacity.notifications'), temporary, { recursive: true });
  fs.copyFileSync(path.join(import.meta.dirname, '../tests/notification.qml'), path.join(temporary, 'components/tst_notification.qml'));
  const result = spawnSync('/usr/lib/qt6/bin/qmltestrunner', ['-platform', 'offscreen', '-input', temporary], {
    cwd: temporary, encoding: 'utf8', timeout: 5000,
    env: { ...process.env, QT_QUICK_BACKEND: 'software', FONTCONFIG_FILE: path.join(root, 'theme/fonts.conf') },
  });
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  if (result.status !== 0) throw new Error(`Native notification test failed: ${result.error?.message ?? result.status}`);
  fs.mkdirSync('harness/evidence', { recursive: true });
  fs.copyFileSync(path.join(temporary, 'notification-download.png'), 'harness/evidence/notification-download.png');
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
