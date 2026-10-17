import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {buildTheme, sourceDirectory} from '../scripts/build-theme.mjs';
import {buildWindowCard,packageWindowCard} from '../scripts/build-window-card.mjs';

test('card build refuses an unaccepted Hyprland commit with the same version number', t => {
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'drokk-card-version-'));
  t.after(()=>fs.rmSync(temp,{recursive:true,force:true}));
  const pkg=path.join(temp,'theme');buildTheme(sourceDirectory,pkg);
  const headers=path.join(temp,'include');fs.mkdirSync(path.join(headers,'hyprland/src'),{recursive:true});
  const version=fs.readFileSync('/usr/include/hyprland/src/version.h','utf8');
  fs.writeFileSync(path.join(headers,'hyprland/src/version.h'),version.replace(/(#define GIT_COMMIT_HASH\s+)"[^"]+"/,'$1"0000000000000000000000000000000000000000"'));
  const pcdir=execFileSync('pkg-config',['--variable=pcfiledir','hyprland'],{encoding:'utf8'}).trim();
  const pc=fs.readFileSync(path.join(pcdir,'hyprland.pc'),'utf8');
  fs.writeFileSync(path.join(temp,'hyprland.pc'),pc.replace(/^Cflags:/m,'Cflags: -I'+headers));
  const previous=process.env.PKG_CONFIG_PATH;
  process.env.PKG_CONFIG_PATH=temp+(previous ? ':'+previous : '');
  try {
    assert.throws(()=>buildWindowCard(pkg,path.join(temp,'out')),/Unsupported Hyprland commit/);
    const standalone=path.join(temp,'standalone');packageWindowCard(pkg,standalone);
    fs.writeFileSync(path.join(standalone,'drokk-window-card.so'),'stale output');
    assert.throws(()=>execFileSync('bash',['build.sh'],{cwd:standalone,encoding:'utf8',stdio:'pipe'}),/Unsupported Hyprland commit/);
    assert.equal(fs.existsSync(path.join(standalone,'drokk-window-card.so')),false,'hyprpm cannot mistake stale output for a successful build');
  }
  finally {if(previous===undefined)delete process.env.PKG_CONFIG_PATH;else process.env.PKG_CONFIG_PATH=previous;}
});
