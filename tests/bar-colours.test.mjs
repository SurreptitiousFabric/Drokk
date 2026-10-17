import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const repo=path.resolve(import.meta.dirname,'..');
function fixture(t) {
  const home=fs.mkdtempSync(path.join(os.tmpdir(),'megacity-bar-test-'));
  t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
  const patches=JSON.parse(fs.readFileSync(path.join(repo,'theme/mega-city-one/source/plugin-colour-patches.json'))).slice(0,2);
  const files=patches.map(p=>{const file=path.join(home,'.config/omarchy/plugins',p.id,p.file);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,p.changes.map(([before])=>before).join('\n'));return file;});
  const state=path.join(home,'.local/state/thememe/live-bar-colours');
  const run=()=>spawnSync(process.execPath,['scripts/apply-live-bar-colours.mjs'],{cwd:repo,env:{...process.env,HOME:home},encoding:'utf8'});
  return{home,patches,files,state,run};
}
test('later recovery conflict leaves all plugin views untouched',t=>{
  const f=fixture(t),before=f.files.map(p=>fs.readFileSync(p));fs.mkdirSync(f.state,{recursive:true});fs.writeFileSync(path.join(f.state,f.patches[1].id+'.'+f.patches[1].file),'existing');
  assert.notEqual(f.run().status,0);f.files.forEach((p,i)=>assert.deepEqual(fs.readFileSync(p),before[i]));
});
test('symlinked plugin and recovery directories are refused without modifying their targets',t=>{
  for (const location of ['plugin','state']) {
    const f=fixture(t),external=path.join(f.home,'external');fs.mkdirSync(external);
    let destination;
    if(location==='plugin') { destination=path.dirname(f.files[0]);fs.renameSync(destination,path.join(external,'plugin'));fs.symlinkSync(path.join(external,'plugin'),destination); }
    else {fs.mkdirSync(path.dirname(f.state),{recursive:true});destination=f.state;fs.symlinkSync(external,destination);}
    const before=f.files.map(p=>fs.readFileSync(p));const r=f.run();assert.notEqual(r.status,0);assert.match(r.stderr,/symlink/i);f.files.forEach((p,i)=>assert.deepEqual(fs.readFileSync(p),before[i]));
  }
});
test('write failure restores earlier views and preserves the previous receipt',t=>{
  const f=fixture(t),before=f.files.map(p=>fs.readFileSync(p));fs.mkdirSync(f.state,{recursive:true});const receipt=path.join(f.state,'receipt.json');fs.writeFileSync(receipt,'[]');
  const blocked=path.dirname(f.files[1]);fs.chmodSync(blocked,0o555);let r;try{r=f.run();}finally{fs.chmodSync(blocked,0o755);}
  assert.notEqual(r.status,0);f.files.forEach((p,i)=>assert.deepEqual(fs.readFileSync(p),before[i]));assert.equal(fs.readFileSync(receipt,'utf8'),'[]');assert.deepEqual(fs.readdirSync(f.state),['receipt.json']);
});
test('successful application preserves permissions and repeated application preserves original hashes',t=>{
  const f=fixture(t);fs.chmodSync(f.files[0],0o640);assert.equal(f.run().status,0);const receipt=fs.readFileSync(path.join(f.state,'receipt.json'));assert.equal(fs.statSync(f.files[0]).mode&0o777,0o640);assert.equal(f.run().status,0);assert.deepEqual(fs.readFileSync(path.join(f.state,'receipt.json')),receipt);
});
test('a repeat run refuses user changes instead of adopting them into its receipt', t => {
  const f = fixture(t);
  assert.equal(f.run().status, 0);
  const receipt = fs.readFileSync(path.join(f.state, 'receipt.json'));
  fs.appendFileSync(f.files[0], '\n// user change\n');
  const changed = fs.readFileSync(f.files[0]);
  assert.notEqual(f.run().status, 0);
  assert.deepEqual(fs.readFileSync(f.files[0]), changed);
  assert.deepEqual(fs.readFileSync(path.join(f.state, 'receipt.json')), receipt);
});
