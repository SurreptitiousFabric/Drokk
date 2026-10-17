import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { serviceCompatibility } from '../scripts/service-compatibility.mjs';
test('guard accepts matching host and rejects changed packages or native service files',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'megacity-compat-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const source=path.join(dir,'source'),host=path.join(dir,'host'),bin=path.join(dir,'bin');fs.mkdirSync(source);fs.mkdirSync(bin);fs.mkdirSync(path.join(host,'shell/plugins/lock'),{recursive:true});
 fs.writeFileSync(path.join(source,'compatibility.json'),JSON.stringify({packages:['omarchy-test 1','quickshell-test 2','hyprland 3']}));
 const crypto=process.getBuiltinModule('crypto');const bytes='native service';const provenance={origin:'/usr/share/omarchy/shell/plugins/lock',files:{'Service.qml':crypto.createHash('sha256').update(bytes).digest('hex')}};
 const files=serviceCompatibility(source,'lock',provenance,{'Service.qml':'custom service'});fs.writeFileSync(path.join(dir,'compatibility.sh'),files['compatibility.sh']);fs.writeFileSync(path.join(host,'shell/plugins/lock/Service.qml'),bytes);
 fs.writeFileSync(path.join(bin,'pacman'),'#!/bin/sh\nprintf "%s\\n" "${FAKE_PACKAGES}"\n',{mode:0o755});
 const run=packages=>spawnSync('bash',[path.join(dir,'compatibility.sh'),host],{env:{...process.env,PATH:bin+':'+process.env.PATH,FAKE_PACKAGES:packages},encoding:'utf8'});
 assert.equal(run('omarchy-test 1\nquickshell-test 2\nhyprland 3').status,0);
 assert.notEqual(run('omarchy-test 9\nquickshell-test 2\nhyprland 3').status,0);
 fs.writeFileSync(path.join(host,'shell/plugins/lock/Service.qml'),'changed');assert.notEqual(run('omarchy-test 1\nquickshell-test 2\nhyprland 3').status,0);
 assert.match(files['Service.qml'],/NativeService.qml/);assert.equal(files['NativeService.qml'],'custom service');
});
test('native QML loader uses custom service only on a matching host and stock on mismatch',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'megacity-qml-compat-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const host=path.join(dir,'host'),bin=path.join(dir,'bin');fs.mkdirSync(bin);fs.mkdirSync(path.join(host,'shell/plugins/lock'),{recursive:true});
 fs.writeFileSync(path.join(dir,'compatibility.json'),JSON.stringify({packages:['omarchy-test 1']}));
 const stock='import QtQuick\nItem { property var shell; property string omarchyPath; objectName: "stock" }\n';
 const custom=stock.replace('"stock"','"custom"');const crypto=process.getBuiltinModule('crypto');
 const files=serviceCompatibility(dir,'lock',{files:{'Service.qml':crypto.createHash('sha256').update(stock).digest('hex')}},{'Service.qml':custom});
 for(const [name,bytes]of Object.entries(files))fs.writeFileSync(path.join(dir,name),bytes);
 fs.writeFileSync(path.join(host,'shell/plugins/lock/Service.qml'),stock);fs.writeFileSync(path.join(bin,'pacman'),'#!/bin/sh\nprintf "%s\\n" "$FAKE_PACKAGES"\n',{mode:0o755});
 fs.copyFileSync('tests/compatibility.qml',path.join(dir,'shell.qml'));
 let runIndex=0;
 for(const [packages,expected]of [['omarchy-test 1','custom'],['omarchy-test 9','stock'],['omarchy-test 1','stock']]){
  if (++runIndex === 3) fs.writeFileSync(path.join(dir,'NativeService.qml'),'invalid QML');
  const r=spawnSync('qs',['-p',dir],{env:{...process.env,PATH:bin+':'+process.env.PATH,QT_QPA_PLATFORM:'offscreen',QT_QUICK_BACKEND:'software',MEGACITY_GUARD_URL:'file://'+dir+'/Service.qml',MEGACITY_GUARD_HOST:host,FAKE_PACKAGES:packages,MEGACITY_EXPECTED_SERVICE:expected},encoding:'utf8',timeout:7000});assert.match((r.stdout ?? "")+(r.stderr ?? ""),/COMPATIBILITY_LOADER_PASS/);assert.equal(r.status,0,(r.stdout ?? "")+(r.stderr ?? "")+String(r.error ?? ""));
 }
});
