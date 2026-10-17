import path from 'node:path';
import { parseArgs } from 'node:util';
import { buildTheme, checkPackage, sourceDirectory } from './build-theme.mjs';
import { installTheme, removeTheme } from './install-theme.mjs';
import { configureTheme, unconfigureTheme } from './configure-theme.mjs';

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    source: { type: 'string', default: sourceDirectory },
    out: { type: 'string', default: path.resolve('dist/mega-city-one') },
    'target-home': { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  } });
  if (positionals.length !== 1) throw new Error('Usage: theme.mjs <build|check|install|remove> [options]');
  const command = positionals[0];
  if (command === 'build' || command === 'check') {
    const manifest = command === 'build' ? buildTheme(values.source, values.out) : checkPackage(values.out);
    console.log(`${command}: ${manifest.name}, ${manifest.files.length} files`);
  } else if (command === 'install') {
    console.log(JSON.stringify(installTheme(values.out, values['target-home'], values['dry-run'])));
  } else if (command === 'configure') {
    console.log(JSON.stringify(configureTheme(values.out, values['target-home'], values['dry-run'])));
  } else if (command === 'unconfigure') {
    console.log(JSON.stringify(unconfigureTheme(values['target-home'], values['dry-run'])));
  } else if (command === 'remove') {
    console.log(JSON.stringify(removeTheme(values['target-home'], values['dry-run'])));
  } else throw new Error('Unknown theme command');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
