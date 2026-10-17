import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkPackage, hash } from './build-theme.mjs';
import { rejectSymlinks, replaceFile } from './user-files.mjs';

export function packageWindowCard(packageRoot, output) {
  checkPackage(packageRoot);
  rejectSymlinks(output);
  const source = path.resolve(import.meta.dirname, '../theme/mega-city-one/source/window-card');
  const { colors } = JSON.parse(fs.readFileSync(path.join(packageRoot, 'preview/model.json')));
  const { roles } = JSON.parse(fs.readFileSync(path.join(packageRoot, 'theme/typography.json')));
  const paint = ['background', 'outline', 'heading', 'text', 'tab'].map(k => colors['panel.' + k]);
  if (paint.some(c => !/^#[0-9a-f]{6}$/i.test(c))) throw new Error('Invalid card palette');
  paint.push(roles.panel.family, roles.panelHeading.family);
  const header = '#pragma once\n#include "CardArtwork.hpp"\nnamespace Drokk {\ninline const CardPaint CARD_PAINT = {' + paint.map(JSON.stringify).join(',') + '};\n}\n';
  fs.mkdirSync(output,{recursive:true});
  for(const name of fs.readdirSync(source))replaceFile(path.join(output,name),fs.readFileSync(path.join(source,name)));
  replaceFile(path.join(output,'CardTheme.hpp'),header);
  replaceFile(path.join(output,'LICENSE'),fs.readFileSync(path.resolve(import.meta.dirname,'../LICENSE')));
  return {modelSha256:hash(header),sourceSha256:Object.fromEntries(fs.readdirSync(source).sort().map(name=>[name,hash(fs.readFileSync(path.join(source,name)))]))};
}

export function buildWindowCard(packageRoot, output) {
  rejectSymlinks(output);
  const run = (program, args, cwd) => execFileSync(program, args, {cwd,encoding:'utf8',timeout:120000,maxBuffer:2**20}).trim();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'drokk-card-build-'));
  try {
    const inputs=packageWindowCard(packageRoot,temp);
    run('bash',['build.sh'],temp);
    const binary = fs.readFileSync(path.join(temp, 'drokk-window-card.so'));
    fs.mkdirSync(output, { recursive: true });
    replaceFile(path.join(output, 'drokk-card.so'), binary, 0o644);
    const receipt = {hyprland:run('pkg-config',['--modversion','hyprland']),compiler:run(process.env.CXX || 'g++',['-dumpfullversion']),binarySha256:hash(binary),...inputs};
    replaceFile(path.join(output, 'build.json'), JSON.stringify(receipt, null, 2) + '\n', 0o644);
    return receipt;
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const packageRoot=path.resolve('dist/mega-city-one');
    if(process.argv[2]==='--package') {
      packageWindowCard(packageRoot,path.resolve('dist/drokk-window-card-source'));
      console.log('Prepared dist/drokk-window-card-source for hyprpm.');
    } else if(process.argv.length===2)console.log(JSON.stringify(buildWindowCard(packageRoot,path.resolve('dist/drokk-window-card')),null,2));
    else throw new Error('Usage: build-window-card.mjs [--package]');
  }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
