// Called only by the explicitly authorised, finite isolated compositor check.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';

export function checkCardHyprpm(root,temp,env) {
  assert.notEqual(env.HYPRLAND_INSTANCE_SIGNATURE,process.env.HYPRLAND_INSTANCE_SIGNATURE);
  const ctl=(...args)=>execFileSync('hyprctl',args,{env,encoding:'utf8',timeout:5000}).trim();
  assert.equal(JSON.parse(ctl('plugin','list','-j')).length,0,'manager check starts with no loaded plugin');
  const version=JSON.parse(ctl('version','-j'));
  const work=path.join(temp,'hyprpm-check'), username=os.userInfo().username;
  const cache=path.join(work,'cache'), state=path.join(cache,username);
  for(const p of ['bin','run','home','repository'])fs.mkdirSync(path.join(work,p),{recursive:true});
  fs.mkdirSync(path.join(state,'headersRoot/share/pkgconfig'),{recursive:true});
  const pcdir=execFileSync('pkg-config',['--variable=pcfiledir','hyprland'],{encoding:'utf8'}).trim();
  fs.copyFileSync(path.join(pcdir,'hyprland.pc'),path.join(state,'headersRoot/share/pkgconfig/hyprland.pc'));
  fs.writeFileSync(path.join(state,'state.toml'),'[state]\nhash = '+JSON.stringify(version.abiHash)+'\ndont_warn_install = true\n');
  fs.cpSync(path.join(root,'dist/drokk-window-card-source'),path.join(work,'repository'),{recursive:true});

  // The manager's privileged filesystem commands run as namespace-root, with
  // write access confined to this disposable cache and fixture directory.
  fs.writeFileSync(path.join(work,'bin/sudo'),[
    '#!/usr/bin/env bash','set -euo pipefail',
    '[[ ${DROKK_HYPRPM_SANDBOX:-} == 1 ]] || exit 1',
    'if [[ ${1:-} == -k ]]; then exit 0; fi',
    'exec /usr/bin/bwrap --unshare-user --uid 0 --gid 0 --ro-bind / / --proc /proc --dev /dev --bind /var/cache/hyprpm /var/cache/hyprpm --bind /test /test -- "$@"',''
  ].join('\n'),{mode:0o755});
  const socket=path.join(env.XDG_RUNTIME_DIR,'hypr',env.HYPRLAND_INSTANCE_SIGNATURE);
  const sandbox=['--unshare-all','--tmpfs','/','--ro-bind','/usr','/usr','--ro-bind','/etc','/etc',
    '--symlink','usr/bin','/bin','--symlink','usr/bin','/sbin','--symlink','usr/lib','/lib','--symlink','usr/lib','/lib64',
    '--proc','/proc','--dev','/dev','--dir','/home','--dir','/run','--dir','/tmp','--bind',work,'/test',
    '--bind',cache,'/var/cache/hyprpm','--ro-bind',socket,'/test/run/hypr/'+env.HYPRLAND_INSTANCE_SIGNATURE,
    '--setenv','HOME','/test/home','--setenv','XDG_RUNTIME_DIR','/test/run',
    '--setenv','PATH','/test/bin:/usr/bin:/bin','--setenv','DROKK_HYPRPM_SANDBOX','1',
    '--chdir','/test/repository'];
  function run(command,args,success=true,input) {
    const result=spawnSync('bwrap',[...sandbox,command,...args],{env,encoding:'utf8',input,timeout:120000,maxBuffer:2**20});
    const output=(result.stdout || '')+(result.stderr || '');
    if(result.error)throw result.error;
    if(success)assert.equal(result.status,0,output.slice(-3000));
    else assert.notEqual(result.status,0,'expected manager to refuse unsupported update');
    return output;
  }
  const git=(...args)=>run('git',args).trim();
  const commit=message=>{git('add','.');git('-c','user.name=Drokk test','-c','user.email=fixture@example.invalid','commit','-qm',message);return git('rev-parse','HEAD');};
  const repository=path.join(work,'repository');
  const manifest=fs.readFileSync(path.join(repository,'hyprpm.toml'),'utf8');
  const pin=hash=>fs.writeFileSync(path.join(repository,'hyprpm.toml'),manifest.replace('commit_pins = []','commit_pins = [['+JSON.stringify(version.commit)+','+JSON.stringify(hash)+']]'));
  const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const installed=path.join(state,'drokk-window-card/drokk-window-card.so');
  const repoState=()=>fs.readFileSync(path.join(state,'drokk-window-card/state.toml'),'utf8');

  git('init','-q','--initial-branch=main');
  const first=commit('fixture compatible source');
  pin(first);commit('fixture version pin');
  const add=run('hyprpm',['add','file:///test/repository'],true,'y\n');
  assert.ok(add.includes('commit pin '+first+' matched'),'manager selects pinned revision');
  assert.ok(fs.existsSync(installed),'manager installs compiled binary');
  assert.match(repoState(),/failed = false/);
  assert.match(repoState(),/enabled = false/);
  const firstHash=hash(installed);
  console.log('PASS: real hyprpm parses manifest, selects a revision and compiles/installs');

  const paint=path.join(repository,'CardTheme.hpp');
  const originalPaint=fs.readFileSync(paint,'utf8');
  const changedPaint=originalPaint.replace(/#[0-9a-f]{6}/i,'#101A24');
  assert.notEqual(changedPaint,originalPaint);
  fs.writeFileSync(paint,changedPaint);
  const second=commit('fixture updated artwork source');
  pin(second);commit('fixture updated version pin');
  const update=run('hyprpm',['update']);
  assert.ok(update.includes('commit pin '+second+' matched'),'manager selects updated pinned revision');
  assert.notEqual(hash(installed),firstHash,'manager replaces the compiled binary');
  assert.match(repoState(),/failed = false/);
  console.log('PASS: real hyprpm update selects the new revision and rebuilds');

  const compatibility=path.join(repository,'Compatibility.hpp');
  fs.writeFileSync(compatibility,fs.readFileSync(compatibility,'utf8').replace(version.commit,'0000000000000000000000000000000000000000'));
  const unsupported=commit('fixture unsupported source');
  pin(unsupported);commit('fixture unsupported version pin');
  const failure=run('hyprpm',['update'],false);
  assert.ok(failure.includes('failed to build'),'manager reports refusal');
  assert.match(repoState(),/failed = true/);
  assert.equal(fs.existsSync(installed),false,'failed rebuild leaves no stale installed binary');
  console.log('PASS: real hyprpm refuses an unsupported revision without installing an old binary');

  run('hyprpm',['remove','drokk-window-card']);
  assert.equal(fs.existsSync(path.join(state,'drokk-window-card')),false);
  assert.equal(ctl('configerrors'),'');
  assert.equal(JSON.parse(ctl('plugin','list','-j')).length,0);
  console.log('PASS: real hyprpm removes its package; isolated compositor remains clean');
}
