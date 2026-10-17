import path from 'node:path';
import { execFileSync } from 'node:child_process';

// User-approved background removal only. Keep original RGB samples unchanged.
const assets = path.resolve(import.meta.dirname, '../theme/mega-city-one/source/assets');
execFileSync('magick', [path.join(assets, 'lock-reference.png'), '-crop', '156x110+758+370', '+repage',
  '-alpha', 'on', '-channel', 'A', '-fx', 'r > b*1.15 && r > g*1.05 && r > 0.17 ? 1 : 0', '+channel',
  'PNG32:' + path.join(assets, 'lock-emblem.png')]);
// Verify every pixel's RGB, even transparent ones, still matches the source crop.
const original = execFileSync('magick', [path.join(assets, 'lock-reference.png'), '-crop', '156x110+758+370', '+repage', '-depth', '8', 'rgb:-']);
const extracted = execFileSync('magick', [path.join(assets, 'lock-emblem.png'), '-depth', '8', 'rgb:-']);
if (!original.equals(extracted)) throw new Error('Extraction changed original RGB samples');
console.log('Lock emblem: alpha-only background removal; all original RGB samples preserved');
