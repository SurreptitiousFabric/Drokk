import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { hash } from './build-theme.mjs';
import { exists, rejectSymlinks, replaceFile } from './user-files.mjs';
import { windowCardEdit } from './session-profile.mjs';
import { transitionText } from './theme-session.mjs';

function locations(home) {
  const l = {profile:path.join(home,'.local/share/drokk/profile.json'),state:path.join(home,'.local/state/drokk/session.json'),
    appearance:path.join(home,'.config/hypr/looknfeel.lua'),directory:path.join(home,'.local/share/drokk/window-card')};
  for(const file of Object.values(l))rejectSymlinks(file);
  return l;
}
function bundle(directory, installed = false) {
  rejectSymlinks(path.join(directory,'build.json'));
  const receipt=fs.readFileSync(path.join(directory,'build.json'));
  const digest=JSON.parse(receipt).binarySha256;
  if(!/^[a-f0-9]{64}$/.test(digest))throw new Error('Invalid card build hash');
  const name=`drokk-card-${digest}.so`, file=path.join(directory,installed ? name : 'drokk-card.so');
  rejectSymlinks(file);
  const binary=fs.readFileSync(file);
  if(digest!==hash(binary))throw new Error('Card binary differs from its build receipt');
  return {receipt,binary,name};
}
function configure(home, install, binaryName) {
  const l=locations(home), edit=windowCardEdit(home,binaryName);
  const profileBytes=fs.readFileSync(l.profile), profile=JSON.parse(profileBytes);
  const appearance=fs.readFileSync(l.appearance,'utf8');
  const current=profile.edits.filter(e=>e.after.includes('-- BEGIN Drokk window card'));
  if(current.length>1 || current.some(e=>JSON.stringify(e)!==JSON.stringify(edit)))throw new Error('Card profile was edited; preserve it for review');
  const active=JSON.parse(fs.readFileSync(l.state)).active;
  const next=install ? (active ? transitionText(appearance,edit,true) : appearance) :
    (appearance.includes(edit.after) ? transitionText(appearance,edit,false) : appearance);
  if(appearance.includes('-- BEGIN Drokk window card') && !appearance.includes(edit.after))throw new Error('Card appearance was edited; preserve it for review');
  if(install && !current.length)profile.edits.push(edit);
  if(!install)profile.edits=profile.edits.filter(e=>!current.includes(e));
  replaceFile(l.profile,JSON.stringify(profile,null,2)+'\n');
  try {if(next!==appearance)replaceFile(l.appearance,next,fs.statSync(l.appearance).mode & 0o777);}
  catch(error){replaceFile(l.profile,profileBytes);throw error;}
}

export function installWindowCard(home, source) {
  const l=locations(home), incoming=bundle(source);
  const previous=exists(l.directory) ? bundle(l.directory,true) : null;
  if(previous && !incoming.binary.equals(previous.binary))
    throw new Error('Remove the existing card before installing a different build');
  fs.mkdirSync(l.directory,{recursive:true});
  try {
    replaceFile(path.join(l.directory,incoming.name),incoming.binary,0o644);
    replaceFile(path.join(l.directory,'build.json'),incoming.receipt,0o644);
    configure(home,true,incoming.name);
  } catch(error) {
    if(previous){replaceFile(path.join(l.directory,previous.name),previous.binary,0o644);replaceFile(path.join(l.directory,'build.json'),previous.receipt,0o644);}
    else fs.rmSync(l.directory,{recursive:true});
    throw error;
  }
}
export function removeWindowCard(home) {
  const l=locations(home);
  let installed;
  if(exists(l.directory)) {
    installed=bundle(l.directory,true);
    if(fs.readdirSync(l.directory).some(n=>!['build.json',installed.name].includes(n)))throw new Error('Unexpected card files; preserve them for review');
  }
  configure(home,false,installed?.name);
  if(exists(l.directory))fs.rmSync(l.directory,{recursive:true});
}

// hyprpm owns the binary; Drokk owns only its existing theme-scoped profile edit.
export function registerManagedWindowCard(home, binary) {
  if(!path.isAbsolute(binary))throw new Error('Expected an absolute hyprpm binary path');
  rejectSymlinks(binary);
  if(!fs.statSync(binary).isFile())throw new Error('hyprpm card binary is not a regular file');
  if(exists(locations(home).directory))throw new Error('Remove the local card before registering the hyprpm card');
  configure(home,true,binary);
}

export function unregisterManagedWindowCard(home, binary) {
  if(!path.isAbsolute(binary))throw new Error('Expected an absolute hyprpm binary path');
  configure(home,false,binary);
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const command=process.argv[2];
    if(!['install','remove','install-hyprpm','remove-hyprpm'].includes(command) || process.argv[3]!=='--live' || process.argv.length!==4)
      throw new Error('Usage: window-card.mjs <install|remove|install-hyprpm|remove-hyprpm> --live');
    const run=(cmd,args)=>execFileSync(cmd,args,{encoding:'utf8',timeout:8000}).trim();
    const lock=JSON.parse(run('omarchy-shell',['lock','status']));
    if(lock.secure || lock.locked || lock.requested || lock.pending || lock.sessionLocked)throw new Error('Operate while unlocked');
    const managedBinary=path.join('/var/cache/hyprpm',os.userInfo().username,'drokk-window-card/drokk-window-card.so');
    if(command.startsWith('install')) {
      const bindings=JSON.parse(run('hyprctl',['binds','-j']));
      if(bindings.some(b=>b.modmask===72 && b.key.toUpperCase()==='I' && b.description!=='Toggle Drokk window card'))
        throw new Error('Super+Alt+I is already bound; choose a free card shortcut before installation');
      if(command==='install-hyprpm')registerManagedWindowCard(process.env.HOME,managedBinary);
      else installWindowCard(process.env.HOME,path.resolve('dist/drokk-window-card'));
    }
    else if(command==='remove-hyprpm')unregisterManagedWindowCard(process.env.HOME,managedBinary);
    else removeWindowCard(process.env.HOME);
    run('hyprctl',['reload']);
    const errors=run('hyprctl',['configerrors']);if(errors)throw new Error(errors);
    console.log('Card '+command+' configuration applied; verify native plugin state.');
  } catch(error){console.error(error.message);process.exitCode=1;}
}
