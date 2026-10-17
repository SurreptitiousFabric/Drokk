import fs from 'node:fs';
import path from 'node:path';
export function exists(p) {
  try { fs.lstatSync(p); return true; } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}
export function rejectSymlinks(p) {
  const absolute = path.resolve(p);
  let current = path.parse(absolute).root;
  for (const part of absolute.slice(current.length).split(path.sep)) {
    current = path.join(current, part);
    if (exists(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error(`Refusing symlink path: ${current}`);
  }
}
export function replaceFile(target, bytes, mode = 0o600) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const stage = fs.mkdtempSync(path.join(path.dirname(target), '.drokk-file-'));
  try {
    const file = path.join(stage, 'replacement');
    fs.writeFileSync(file, bytes, { mode });
    fs.chmodSync(file, mode);
    fs.renameSync(file, target);
  } finally { fs.rmSync(stage, { recursive: true, force: true }); }
}
