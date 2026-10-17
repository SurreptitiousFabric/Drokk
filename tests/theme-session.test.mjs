import test from 'node:test';
import assert from 'node:assert/strict';
import { transitionShell, transitionText } from '../scripts/theme-session.mjs';

test('switching away replaces only Drokk widgets and restores native services', () => {
  const config={bar:{layout:{left:[{id:'megacity.menu',custom:7},{id:'megacity.workspaces'}],right:[{id:'personal.widget'}]}},plugins:[{id:'personal.service'},{id:'megacity.lock'},{id:'megacity.notifications'}],disabledPlugins:['personal.disabled','omarchy.lock','omarchy.notifications'],idle:{lock:321}};
  const next=transitionShell(config,false);
  assert.deepEqual(next.bar.layout.left,[{id:'omarchy.menu',custom:7},{id:'omarchy.workspaces'}]);
  assert.deepEqual(next.bar.layout.right,[{id:'personal.widget'}]);
  assert.deepEqual(next.plugins,[{id:'personal.service'}]);
  assert.deepEqual(next.disabledPlugins,['personal.disabled']);
  assert.deepEqual(next.idle,{lock:321});
  assert.deepEqual(config.bar.layout.left[0].id,'megacity.menu');
  assert.deepEqual(transitionShell(next,false),next);
  assert.deepEqual(transitionShell(transitionShell(next,true),false),next);
});
test('owned fragments restore without losing unrelated edits and refuse changed owned fragments', () => {
  const edit={path:'example',before:'old font\n',after:'theme font\n'};
  assert.equal(transitionText('prefix\nold font\nsuffix\n',edit,true),'prefix\ntheme font\nsuffix\n');
  assert.equal(transitionText('new user setting\ntheme font\nsuffix\n',edit,false),'new user setting\nold font\nsuffix\n');
  assert.throws(()=>transitionText('user font\n',edit,false),/changed/);
  assert.equal(transitionText('custom CSS\n',{path:'css',before:'',after:'owned block\n'},true),'custom CSS\nowned block\n');
});

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { applySession } from '../scripts/theme-session.mjs';
import { windowCardEdit } from '../scripts/session-profile.mjs';

function fixture(t) {
  const home=fs.mkdtempSync(path.join(os.tmpdir(),'drokk-session-'));
  t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
  const write=(name,value)=>{const f=path.join(home,name);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,value);};
  const read=name=>fs.readFileSync(path.join(home,name),'utf8');
  write('.config/omarchy/shell.json',JSON.stringify({bar:{layout:{left:[{id:'omarchy.menu'}]}},plugins:[],disabledPlugins:[]}));
  write('.config/example','font=original\nuser=keep\n');
  write('.local/share/drokk/profile.json',JSON.stringify({edits:[{path:'.config/example',before:'font=original\n',after:'font=drokk\n'}],settings:{'font-name':"'Theme Font'"}}));
  const values={'font-name':"'My Font'"};
  const settings={read:key=>values[key],write:(key,value)=>{values[key]=value;}};
  return {home,write,read,values,settings};
}
test('window-card registration leaves on theme switch and disable, then returns on enable', t => {
  const f = fixture(t), p = JSON.parse(f.read('.local/share/drokk/profile.json'));
  const edit = windowCardEdit(f.home);
  p.edits.push(edit);
  f.write('.local/share/drokk/profile.json', JSON.stringify(p));
  f.write('.config/hypr/looknfeel.lua', '-- personal appearance\n');
  applySession(f.home, 'drokk', f.settings);
  assert.match(f.read(edit.path), /hl\.plugin\.load/);
  f.write(edit.path, f.read(edit.path) + '-- later user edit\n');
  applySession(f.home, 'dune', f.settings);
  assert.equal(f.read(edit.path), '-- personal appearance\n-- later user edit\n');
  applySession(f.home, 'drokk', f.settings);
  applySession(f.home, 'drokk', f.settings, false);
  assert.equal(f.read(edit.path), '-- personal appearance\n-- later user edit\n');
  applySession(f.home, 'drokk', f.settings, true);
  assert.equal(f.read(edit.path).split('hl.plugin.load').length, 2);
});
test('shell-owned files stay untouched when the shell cannot stop safely', t => {
  const f=fixture(t), original=f.read('.config/omarchy/shell.json');
  assert.throws(()=>applySession(f.home,'drokk',f.settings,undefined,{
    stop(){throw new Error('shell still running');},start(){assert.fail('must not start another shell');}
  }),/shell still running/);
  assert.equal(f.read('.config/omarchy/shell.json'),original);
  assert.equal(f.read('.config/example'),'font=original\nuser=keep\n');
});
test('shell resumes after a complete theme write or a restored failed write', t => {
  for(const fail of [false,true]) {
    const f=fixture(t), original=f.read('.config/omarchy/shell.json');
    let running=true, starts=0;
    const settings={...f.settings,write(key,value){
      assert.equal(running,false,'shell cannot observe partially applied files');
      if(fail && value==="'Theme Font'")throw new Error('settings unavailable');
      f.settings.write(key,value);
    }};
    const lifecycle={stop(){assert.equal(f.read('.config/omarchy/shell.json'),original);running=false;},start(){
      assert.equal(running,false);starts++;running=true;
      assert.equal(f.read('.config/example'),fail ? 'font=original\nuser=keep\n' : 'font=drokk\nuser=keep\n');
      assert.equal(JSON.parse(f.read('.config/omarchy/shell.json')).bar.layout.left[0].id,fail ? 'omarchy.menu' : 'megacity.menu');
    }};
    const apply=()=>applySession(f.home,'drokk',settings,undefined,lifecycle);
    if(fail)assert.throws(apply,/settings unavailable/);else apply();
    assert.equal(running,true);assert.equal(starts,1);
    if(!fail)applySession(f.home,'drokk',settings,undefined,{stop(){assert.fail('unchanged theme needs no restart');}});
  }
});
test('reselecting Drokk retains the baseline and switching away preserves unrelated edits', t=>{
  const f=fixture(t);
  applySession(f.home,'mega-city-one',f.settings);
  applySession(f.home,'mega-city-one',f.settings);
  f.write('.config/example',f.read('.config/example')+'new=user setting\n');
  applySession(f.home,'dune',f.settings);
  assert.equal(f.values['font-name'],"'My Font'");
  assert.equal(f.read('.config/example'),'font=original\nuser=keep\nnew=user setting\n');
  assert.equal(JSON.parse(f.read('.config/omarchy/shell.json')).bar.layout.left[0].id,'omarchy.menu');
});
test('activation failure restores files and preferences together', t=>{
  const f=fixture(t), original=f.read('.config/omarchy/shell.json');
  f.settings.write=(key,value)=>{if(value==="'Theme Font'") throw new Error('settings unavailable'); f.values[key]=value;};
  assert.throws(()=>applySession(f.home,'mega-city-one',f.settings),/settings unavailable/);
  assert.equal(f.read('.config/omarchy/shell.json'),original);
  assert.equal(f.read('.config/example'),'font=original\nuser=keep\n');
  assert.equal(fs.existsSync(path.join(f.home,'.local/state/drokk/session.json')),false);
  assert.equal(f.values['font-name'],"'My Font'");
});
test('bar transparency follows the theme while a user change wins on departure', t=>{
  const f=fixture(t), config=JSON.parse(f.read('.config/omarchy/shell.json'));
  config.bar.transparent=false; f.write('.config/omarchy/shell.json',JSON.stringify(config));
  const p=JSON.parse(f.read('.local/share/drokk/profile.json')); p.transparentBar=true;
  f.write('.local/share/drokk/profile.json',JSON.stringify(p));
  applySession(f.home,'mega-city-one',f.settings);
  assert.equal(JSON.parse(f.read('.config/omarchy/shell.json')).bar.transparent,true);
  applySession(f.home,'dune',f.settings);
  assert.equal(JSON.parse(f.read('.config/omarchy/shell.json')).bar.transparent,false);
});
test('changed theme settings and user-created files are preserved and reported', t=>{
  const f=fixture(t), p=JSON.parse(f.read('.local/share/drokk/profile.json'));
  p.edits.push({path:'.config/new.conf',before:'',after:'theme file\n',wholeFile:true,beforeAbsent:true});
  f.write('.local/share/drokk/profile.json',JSON.stringify(p));
  applySession(f.home,'mega-city-one',f.settings);
  f.write('.config/example','font=user changed\n');
  f.values['font-name']="'User Changed'";
  const result=applySession(f.home,'dune',f.settings);
  assert.equal(result.preserved.length,1);
  assert.equal(f.read('.config/example'),'font=user changed\n');
  assert.equal(f.values['font-name'],"'User Changed'");
  assert.equal(fs.existsSync(path.join(f.home,'.config/new.conf')),false);
  f.write('.config/new.conf','user file\n');
  const back=applySession(f.home,'mega-city-one',f.settings);
  assert.equal(back.preserved.length,2);
  assert.equal(f.read('.config/new.conf'),'user file\n');
});
test('a symlink target is rejected before any shell or setting changes', t=>{
  const f=fixture(t), original=f.read('.config/omarchy/shell.json');
  fs.renameSync(path.join(f.home,'.config/example'),path.join(f.home,'outside'));
  fs.symlinkSync(path.join(f.home,'outside'),path.join(f.home,'.config/example'));
  assert.throws(()=>applySession(f.home,'mega-city-one',f.settings),/symlink/);
  assert.equal(f.read('.config/omarchy/shell.json'),original);
  assert.equal(f.values['font-name'],"'My Font'");
});
test('a failed settings rollback still restores files', t=>{
  const f=fixture(t), original=f.read('.config/omarchy/shell.json');
  f.settings.write=()=>{throw new Error('settings service unavailable');};
  assert.throws(()=>applySession(f.home,'mega-city-one',f.settings),/settings service unavailable/);
  assert.equal(f.read('.config/omarchy/shell.json'),original);
  assert.equal(f.read('.config/example'),'font=original\nuser=keep\n');
});
test('disabled extras stay disabled when the theme is reselected and can be enabled again', t=>{
  const f=fixture(t);
  applySession(f.home,'mega-city-one',f.settings);
  applySession(f.home,'mega-city-one',f.settings,false);
  applySession(f.home,'mega-city-one',f.settings);
  assert.equal(JSON.parse(f.read('.config/omarchy/shell.json')).bar.layout.left[0].id,'omarchy.menu');
  assert.equal(f.values['font-name'],"'My Font'");
  applySession(f.home,'mega-city-one',f.settings,true);
  assert.equal(JSON.parse(f.read('.config/omarchy/shell.json')).bar.layout.left[0].id,'megacity.menu');
});
test('reselection reapplies icons after the native theme hook without losing the original preference', t=>{
  const f=fixture(t),p=JSON.parse(f.read('.local/share/drokk/profile.json'));
  p.settings['icon-theme']="'Drokk Icons'";f.values['icon-theme']="'Native Icons'";
  f.write('.local/share/drokk/profile.json',JSON.stringify(p));
  applySession(f.home,'mega-city-one',f.settings);
  f.values['icon-theme']="'Native Icons'";
  applySession(f.home,'mega-city-one',f.settings);
  assert.equal(f.values['icon-theme'],"'Drokk Icons'");
  assert.equal(JSON.parse(f.read('.local/state/drokk/session.json')).settingsBefore['icon-theme'],"'Native Icons'");
});
test('removing a required companion restores stock services instead of enabling a missing plugin', t=>{
  const f=fixture(t),p=JSON.parse(f.read('.local/share/drokk/profile.json'));
  p.companions=['megacity.menu'];f.write('.local/share/drokk/profile.json',JSON.stringify(p));
  f.write('.config/omarchy/plugins/megacity.menu/manifest.json',JSON.stringify({id:'megacity.menu'}));
  applySession(f.home,'drokk',f.settings);
  fs.rmSync(path.join(f.home,'.config/omarchy/plugins/megacity.menu'),{recursive:true});
  const result=applySession(f.home,'drokk',f.settings);
  assert.equal(result.active,false);
  assert.match(result.preserved[0],/unavailable/);
  assert.equal(JSON.parse(f.read('.config/omarchy/shell.json')).bar.layout.left[0].id,'omarchy.menu');
  assert.equal(f.values['font-name'],"'My Font'");
});
