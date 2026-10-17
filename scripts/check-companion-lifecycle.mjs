// Explicit live acceptance exercise. Uses Omarchy's own removal and validation.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { checkPackage, hash } from './build-theme.mjs';
import { rejectSymlinks } from './user-files.mjs';
if (process.argv[2] !== '--live-profile') throw new Error('Requires --live-profile; run only while extras are disabled and the session is unlocked');
const home = process.env.HOME, pkg = path.resolve('dist/mega-city-one');
const root = path.join(home, '.config/omarchy/plugins');
const run = (cmd, args) => execFileSync(cmd, args, {encoding:'utf8',timeout:8000}).trim();
const state = JSON.parse(fs.readFileSync(path.join(home,'.local/state/drokk/session.json')));
if (state.active || state.enabled !== false) throw new Error('Disable Drokk extras before lifecycle acceptance');
const lock = JSON.parse(run('omarchy-shell',['lock','status']));
if (lock.secure || lock.locked || lock.requested || lock.pending) throw new Error('Session must be unlocked');
const files = checkPackage(pkg).files.filter(f => f.path.startsWith('plugins/'));
const ids = [...new Set(files.map(f=>f.path.split('/')[1]))];
const catalog = JSON.parse(run('omarchy-shell',['shell','listPlugins']));
for (const id of ids) if (catalog.find(p=>p.id===id)?.enabled !== false) throw new Error('Companion is not disabled: '+id);
function verify(id, directory) {
  rejectSymlinks(directory);
  const expected=files.filter(f=>f.path.split('/')[1]===id);
  const actual=fs.readdirSync(directory,{recursive:true,withFileTypes:true});
  if(actual.some(e=>e.isSymbolicLink())) throw new Error('Companion contains symlink: '+id);
  if(actual.filter(e=>e.isFile()).length!==expected.length) throw new Error('Companion contains extra files: '+id);
  for(const f of expected) {
    const file=path.join(directory,f.path.split('/').slice(2).join('/'));rejectSymlinks(file);
    if(hash(fs.readFileSync(file))!==f.sha256)throw new Error('Companion has local edits: '+file);
  }
}
for(const id of ids)verify(id,path.join(root,id));
const removed=[];
try {
  for(const id of ids) {
    const before=new Set(fs.readdirSync(root));
    run('omarchy',['plugin','remove',id,'--yes']);
    const backups=fs.readdirSync(root).filter(n=>!before.has(n)&&n.startsWith('.'+id+'.bak.'));
    if(backups.length!==1)throw new Error('Cannot identify native removal recovery directory: '+id);
    removed.push({id,backup:path.join(root,backups[0])});
    console.log('Removed '+id+' through Omarchy');
  }
  // rescanPlugins returns before its finite manifest scan finishes.
  run('omarchy-shell',['shell','rescanPlugins']);
  await new Promise(resolve=>setTimeout(resolve,750));
  const without=JSON.parse(run('omarchy-shell',['shell','listPlugins']));
  if(without.some(p=>ids.includes(p.id)))throw new Error('Removed companion still discovered');
  if(run('omarchy-shell',['notifications','ping'])!=='ok')throw new Error('Stock notifications unavailable');
  JSON.parse(run('omarchy-shell',['lock','status']));
  console.log('Stock services work with all eight companions removed');
  for(const {id}of removed) {
    fs.cpSync(path.join(pkg,'plugins',id),path.join(root,id),{recursive:true,errorOnExist:true,force:false});
    verify(id,path.join(root,id));
    run('omarchy',['plugin','validate',path.join(root,id)]);
    console.log('Reinstalled and validated '+id);
  }
  run('omarchy-shell',['shell','rescanPlugins']);
  await new Promise(resolve=>setTimeout(resolve,750));
  const restored=JSON.parse(run('omarchy-shell',['shell','listPlugins']));
  for(const id of ids)if(restored.find(p=>p.id===id)?.enabled!==false)throw new Error('Reinstalled companion state incorrect: '+id);
  for(const {id,backup}of removed){verify(id,backup);fs.rmSync(backup,{recursive:true});}
  console.log('PASS: live removal, stock operation, clean reinstall, validation and inactive discovery');
} catch(error) {
  // Restore only directories removed in this invocation; retain uncertain copies.
  for(const {id,backup}of removed)if(!fs.existsSync(path.join(root,id))&&fs.existsSync(backup))fs.renameSync(backup,path.join(root,id));
  run('omarchy-shell',['shell','rescanPlugins']);
  throw error;
}
