// Explicit, finite nested-compositor acceptance; requires permission to launch children.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { windowCardEdit } from './session-profile.mjs';
import { checkCardHyprpm } from './check-card-hyprpm.mjs';

if (process.argv[2] !== '--isolated' || process.argv.slice(3).some(a=>a!=='--hyprpm')) throw new Error('Usage: mise exec -- node scripts/check-window-card.mjs --isolated [--hyprpm]');
const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'drokk-card-check-'));
const plugin = path.join(root, 'dist/drokk-window-card/drokk-card.so');
const evidence = path.join(root, 'harness/evidence/window-card');
const children = [];
let env, compositor, compositorOutput = '';
const run = (cmd, args, options = {}) => execFileSync(cmd, args, { env, timeout: 5000, maxBuffer: 32 * 1024 * 1024, ...options });
const ctl = (...args) => run('hyprctl', args, { encoding: 'utf8' }).trim();
const dispatch = expression => assert.equal(ctl('dispatch', expression), 'ok');
const windows = () => JSON.parse(ctl('clients', '-j'));
const cardWindow = name => { const w = windows().find(w => w.title.startsWith(name)); assert.ok(w, name + ' exists'); return w; };
const selector = w => JSON.stringify('address:' + w.address);
const start = (cmd, args, options = {}) => { const child = spawn(cmd, args, { env, stdio: 'ignore', ...options }); children.push(child); return child; };
function pixels() {
  const ppm = run('grim', ['-t', 'ppm', '-']);
  const header = ppm.subarray(0, 80).toString().match(/^P6\n(\d+) (\d+)\n255\n/);
  assert.ok(header, 'PPM screenshot header');
  return { data: ppm.subarray(header[0].length), width: +header[1], height: +header[2] };
}
function redPixels(w) {
  const image = pixels(); let count = 0;
  const scale=JSON.parse(ctl('monitors','-j'))[0].scale;
  for (let y = Math.max(0, Math.round((w.at[1] + w.size[1] - 144)*scale)); y < Math.min(image.height, (w.at[1] + w.size[1])*scale); y++)
    for (let x = Math.max(0, Math.round((w.at[0] + w.size[0] - 208)*scale)); x < Math.min(image.width, (w.at[0] + w.size[0] + 10)*scale); x++) {
      const i = (y * image.width + x) * 3;
      if (image.data[i] > 100 && image.data[i] > image.data[i + 1] * 2 && Math.abs(image.data[i + 1] - image.data[i + 2]) < 20) count++;
    }
  return count;
}
function click(x, y) {
  const monitor = JSON.parse(ctl('monitors', '-j'))[0];
  run(path.join(temp, 'pointer'), [String(x), String(y), String(monitor.width/monitor.scale), String(monitor.height/monitor.scale)]);
  assert.equal(ctl('cursorpos'),`${x}, ${y}`,'test pointer reached its target');
}
function tab(w) { click(w.at[0] + w.size[0] + 5, w.at[1] + w.size[1] - 78); }
function place(w, x, y, width, height) {
  if (!w.floating) dispatch(`hl.dsp.window.float({window=${selector(w)},action="toggle"})`);
  dispatch(`hl.dsp.window.resize({window=${selector(w)},x=${width},y=${height}})`);
  dispatch(`hl.dsp.window.move({window=${selector(w)},x=${x},y=${y}})`);
}

try {
  const cflags = execFileSync('pkg-config', ['--cflags', '--libs', 'wayland-client'], {encoding:'utf8'}).trim().split(/\s+/);
  execFileSync('/usr/bin/gcc', [path.join(root, 'tests/card-pointer.c'), '-o', path.join(temp, 'pointer'), ...cflags], {timeout:10000});
  const config = path.join(temp, 'hyprland.lua');
  const registration = windowCardEdit(temp).after.replace(JSON.stringify(path.join(temp,'.local/share/drokk/window-card/drokk-card.so')),JSON.stringify(plugin));
  const base = `hl.monitor({output="",mode="1280x800@60",position="0x0",scale=1})
hl.config({general={border_size=2,gaps_in=10,gaps_out=20},input={resolve_binds_by_sym=true},animations={enabled=false},decoration={rounding=0,shadow={enabled=false},blur={enabled=false}},misc={disable_hyprland_logo=true,disable_splash_rendering=true},debug={disable_logs=true}})
inputCycles=0
hl.bind("SUPER + SHIFT + I",function() inputCycles=inputCycles+1 end,{description="Input layout fixture"})
hl.on("hyprland.start",function()
 local f=assert(io.open(${JSON.stringify(path.join(temp, 'ready.tmp'))},"w"))
 f:write(os.getenv("HYPRLAND_INSTANCE_SIGNATURE"),"\\n",os.getenv("WAYLAND_DISPLAY")); f:close()
 os.rename(${JSON.stringify(path.join(temp, 'ready.tmp'))},${JSON.stringify(path.join(temp, 'ready'))})
end)
`;
  fs.writeFileSync(config, base + registration);
  const watcher = fs.watch(temp);
  const ready = new Promise((resolve, reject) => {
    const timer = setTimeout(() => { watcher.close(); reject(new Error('Nested compositor startup timed out')); }, 8000);
    watcher.on('change', (_event, name) => { if (name === 'ready' && fs.existsSync(path.join(temp, 'ready'))) { clearTimeout(timer); watcher.close(); resolve(); } });
  });
  compositor = start('Hyprland', ['-c', config], {env:{...process.env,AQ_DRM_DEVICES:'/dev/null',XDG_CONFIG_HOME:temp,XDG_CACHE_HOME:temp,XDG_STATE_HOME:temp},stdio:['ignore','pipe','pipe']});
  compositor.stdout.on('data', data => { compositorOutput = (compositorOutput + data).slice(-2000); });
  compositor.stderr.on('data', data => { compositorOutput = (compositorOutput + data).slice(-2000); });
  await ready;
  const [signature, socket] = fs.readFileSync(path.join(temp,'ready'),'utf8').split('\n');
  assert.notEqual(signature,process.env.HYPRLAND_INSTANCE_SIGNATURE);
  assert.notEqual(socket,process.env.WAYLAND_DISPLAY);
  env = {...process.env, HYPRLAND_INSTANCE_SIGNATURE:signature, WAYLAND_DISPLAY:socket, DROKK_CARD_TEST_SIGNATURE:signature, QT_QPA_PLATFORM:'wayland', QT_QUICK_CONTROLS_STYLE:'Basic'};
  await delay(400);
  assert.equal(ctl('configerrors'), '');
  assert.match(ctl('plugin','list'), /drokk-window-card/);
  const nestedOutputs=JSON.parse(ctl('monitors','-j'));
  assert.equal(ctl('output','create','headless','CARD-CHECK'),'ok');
  await delay(150);
  for(const monitor of nestedOutputs) assert.equal(ctl('output','remove',monitor.name),'ok');
  await delay(150);
  console.log('PASS: native plugin loaded in isolated compositor');
  for (const name of ['CardCheck-A', 'CardCheck-B']) {
    const qml = path.join(temp, name + '.qml');
    fs.writeFileSync(qml, `import QtQuick\nimport QtQuick.Window\nWindow { id:checkWindow; visible:true; width:600; height:430; color:"#303840"; property int clicks:0; title:"${name} clicks="+clicks; Text{anchors.centerIn:parent;text:"Disposable card check";color:"white"} MouseArea{anchors.fill:parent;onClicked:checkWindow.clicks++} }`);
    start('qml6', [qml]);
  }
  await delay(600);
  let a = cardWindow('CardCheck-A'), b = cardWindow('CardCheck-B');
  const right = [a,b].sort((a,b)=>b.at[0]-a.at[0])[0];
  assert.ok(redPixels(right)>400,'right tiled card is visible');
  tab(right);await delay(150);
  assert.equal(redPixels(right),0,'rightmost tiled tab tucks card');
  tab(right);await delay(150);
  assert.ok(redPixels(right)>400,'rightmost tiled tab reopens card');
  console.log('PASS: rightmost tiled window tab');
  dispatch(`hl.dsp.focus({window=${selector(right)}})`);
  assert.equal(JSON.parse(ctl('activewindow','-j')).address,right.address,'keyboard test focus');
  assert.ok(JSON.parse(ctl('binds','-j')).some(b=>b.modmask===72 && b.key==='I'),'Super+Alt+I shortcut is registered');
  run('wtype',['-s','100','-M','logo','-M','shift','-s','100','-k','I','-s','100']);await delay(150);
  assert.equal(ctl('eval','assert(inputCycles==1,"input-layout shortcut was intercepted")'),'ok');
  assert.ok(redPixels(right)>400,'Super+Shift+I leaves the card open');
  assert.equal(ctl('eval','hl.plugin.drokk_card.toggle()'),'ok');await delay(150);
  assert.equal(redPixels(right),0,'public action tucks focused card');
  assert.equal(ctl('eval','hl.plugin.drokk_card.toggle()'),'ok');await delay(150);
  run('wtype',['-s','100','-M','logo','-M','alt','-s','100','-k','I','-s','100']);await delay(150);
  assert.equal(redPixels(right),0,'keyboard action tucks focused card');
  const other=[a,b].find(w=>w.address!==right.address);
  assert.ok(redPixels(other)>400,'keyboard action leaves other cards open');
  run('wtype',['-s','100','-M','logo','-M','alt','-s','100','-k','I','-s','100']);await delay(150);
  assert.ok(redPixels(right)>400,'keyboard action reopens focused card');
  console.log('PASS: real shortcut toggles only the active window card');
  const managed = registration.replace(/^.*pcall\(hl\.plugin\.load, path\).*\n/m, '');
  fs.writeFileSync(config,base);ctl('reload');await delay(250);
  assert.equal(ctl('plugin','load',plugin),'ok');await delay(250);
  assert.equal(redPixels(right),0,'manager-loaded card stays inactive without Drokk configuration');
  fs.writeFileSync(config,base+managed);ctl('reload');await delay(250);
  assert.ok(redPixels(right)>400,'Drokk enables a manager-loaded card');
  fs.writeFileSync(config,base);ctl('reload');await delay(250);
  assert.match(ctl('plugin','list'),/drokk-window-card/,'manager still owns loaded library');
  assert.equal(redPixels(right),0,'theme departure removes manager-loaded card');
  for(const w of windows())assert.doesNotMatch(ctl('decorations','address:'+w.address),/Drokk window card/,'no input reservation remains');
  assert.ok(!JSON.parse(ctl('binds','-j')).some(b=>b.description==='Toggle Drokk window card'),'theme departure removes card shortcut');
  assert.equal(ctl('plugin','unload',plugin),'ok');
  fs.writeFileSync(config,base+registration);ctl('reload');await delay(250);
  console.log('PASS: manager-loaded library obeys theme activation and cleanup');
  fs.writeFileSync(config,base.replace('1280x800@60','2560x1600@60').replace('scale=1','scale=2').replace('gaps_out=20','gaps_out=0')+registration);
  ctl('reload');await delay(350);
  assert.equal(ctl('eval','assert(type(hl.plugin.drokk_card)=="table", "card action missing after reload")'),'ok');
  assert.equal(JSON.parse(ctl('monitors','-j'))[0].scale,2,'scaled output fixture');
  const edge=windows().sort((a,b)=>b.at[0]-a.at[0])[0];
  assert.ok(edge.at[0]+edge.size[0]+9<=1280,'full tab fits at screen edge');
  tab(edge);await delay(150);assert.equal(redPixels(edge),0,'2x edge tab tucks');
  tab(edge);await delay(150);assert.ok(redPixels(edge)>400,'2x edge tab reopens');
  fs.mkdirSync(evidence,{recursive:true});run('grim',[path.join(evidence,'isolated-edge-2x.png')]);
  fs.writeFileSync(config,base+registration);ctl('reload');await delay(350);
  console.log('PASS: 2x scale with no outer gap keeps edge tab clickable');
  place(a, 40, 80, 600, 430); place(b, 730, 80, 400, 430);
  dispatch(`hl.dsp.focus({window=${selector(a)}})`);
  await delay(250);
  a = cardWindow('CardCheck-A'); b = cardWindow('CardCheck-B');
  fs.mkdirSync(evidence,{recursive:true}); run('grim',[path.join(evidence,'isolated-open.png')]);
  assert.ok(redPixels(a) > 400, 'open card is rendered');
  assert.ok(redPixels(b) > 400, 'inactive window also has its card');
  console.log('PASS: real active and inactive windows have cards');
  dispatch('hl.dsp.focus({workspace="2"})');await delay(150);
  assert.equal(redPixels(a),0,'card stays on its owner workspace');
  dispatch('hl.dsp.focus({workspace="1"})');await delay(150);
  assert.ok(redPixels(a)>400,'card returns with owner workspace');
  click(a.at[0]+100,a.at[1]+100); await delay(300);
  assert.equal(cardWindow('CardCheck-A').title,'CardCheck-A clicks=1','test pointer reaches plain application body');
  click(a.at[0]+a.size[0]-100,a.at[1]+a.size[1]-70);
  await delay(150);
  assert.equal(cardWindow('CardCheck-A').title, 'CardCheck-A clicks=2', 'body click reaches application');
  tab(a); await delay(150);
  assert.equal(redPixels(a),0,'tucked card body disappears');
  assert.equal(cardWindow('CardCheck-A').title,'CardCheck-A clicks=2','tab click does not reach application');
  tab(a); await delay(150); assert.ok(redPixels(a)>400,'tab reopens card');
  console.log('PASS: body passes clicks through; tab tucks and reopens');
  fs.writeFileSync(config,base.replace('animations={enabled=false}','animations={enabled=true}')+registration);
  ctl('reload');await delay(250);
  const monitor=JSON.parse(ctl('monitors','-j'))[0];
  const held=start(path.join(temp,'pointer'),[String(a.at[0]+a.size[0]+5),String(a.at[1]+a.size[1]-78),String(monitor.width),String(monitor.height),'hold'],{stdio:['ignore','pipe','ignore']});
  const heldExit=once(held,'exit'); await once(held.stdout,'data');
  const during=redPixels(a);
  assert.ok(during>0,'body remains visible during slide');
  await heldExit;assert.equal(redPixels(a),0,'slide completes tucked');
  tab(a);await delay(100);assert.ok(redPixels(a)>400,'animated open completes');
  fs.writeFileSync(config,base+registration);ctl('reload');await delay(250);
  console.log('PASS: animated slide and disabled-animation instant toggle');
  place(a,80,160,520,390); await delay(150); a=cardWindow('CardCheck-A');
  assert.ok(redPixels(a)>400,'card follows move and resize');
  place(b,a.at[0]+a.size[0]-250,a.at[1]+a.size[1]-160,500,350);
  dispatch(`hl.dsp.window.alter_zorder({window=${selector(b)},mode="top"})`);
  await delay(150); assert.equal(redPixels(a),0,'covering window hides owner card');
  console.log('PASS: move/resize attachment and window stacking');
  place(b,730,80,400,430);
  dispatch(`hl.dsp.group.toggle({window=${selector(a)}})`);
  dispatch(`hl.dsp.window.move({window=${selector(b)},into_group="l"})`);
  await delay(150);
  assert.equal(cardWindow('CardCheck-A').grouped.length,2,'group has a hidden member');
  fs.writeFileSync(config,base);ctl('reload');await delay(250);
  assert.equal(ctl('plugin','load',plugin),'ok');await delay(200);
  fs.writeFileSync(config,base+managed);ctl('reload');await delay(200);
  assert.ok(windows().some(w=>ctl('decorations','address:'+w.address).includes('Drokk window card')),'manager card attached to group');
  fs.writeFileSync(config,base); ctl('reload'); await delay(350);
  assert.match(ctl('plugin','list'),/drokk-window-card/,'grouped theme cleanup keeps manager library loaded');
  assert.ok(!JSON.parse(ctl('binds','-j')).some(b=>b.description==='Toggle Drokk window card'),'unload removes shortcut');
  for(const w of [a,b]) assert.doesNotMatch(ctl('decorations','address:'+w.address),/Drokk window card/,'unload also removes hidden group-member decoration');
  assert.equal(ctl('plugin','unload',plugin),'ok');
  dispatch('hl.dsp.group.prev()');
  dispatch(`hl.dsp.group.toggle({window=${selector(a)}})`);
  fs.writeFileSync(config,base+registration);ctl('reload');await delay(350);
  console.log('PASS: hidden grouped-window unload');
  dispatch(`hl.dsp.window.close({window=${selector(b)}})`);
  dispatch(`hl.dsp.focus({window=${selector(a)}})`);
  dispatch(`hl.dsp.window.fullscreen({window=${selector(a)},mode="fullscreen"})`);
  await delay(150); assert.equal(redPixels(cardWindow('CardCheck-A')),0,'fullscreen hides card');
  dispatch(`hl.dsp.window.fullscreen({window=${selector(a)},mode="fullscreen"})`);
  await delay(150); a=cardWindow('CardCheck-A'); assert.ok(redPixels(a)>400);
  fs.writeFileSync(config,base); ctl('reload'); await delay(350);
  assert.doesNotMatch(ctl('plugin','list'),/drokk-window-card/);
  assert.ok(!fs.readFileSync(`/proc/${compositor.pid}/maps`,'utf8').includes(plugin),'unload releases native library mapping');
  assert.equal(redPixels(a),0,'unload removes card');
  fs.writeFileSync(config,base+registration); ctl('reload'); await delay(350);
  assert.match(ctl('plugin','list'),/drokk-window-card/);
  assert.ok(redPixels(a)>400,'reload reattaches existing window');
  dispatch(`hl.dsp.window.close({window=${selector(a)}})`); await delay(150);
  assert.equal(windows().length,0);
  assert.equal(ctl('eval','hl.plugin.drokk_card.toggle()'),'ok','no focused window is harmless');
  fs.writeFileSync(config,base); ctl('reload'); await delay(200);
  assert.doesNotMatch(ctl('plugin','list'),/drokk-window-card/);
  console.log('PASS: fullscreen, unload/reload and window-close cleanup');
  if(process.argv.includes('--hyprpm'))checkCardHyprpm(root,temp,env);
} catch (error) {
  console.error(error.message);
  if (!env) console.error(compositorOutput);
  process.exitCode=1;
} finally {
  for (const child of children.reverse()) if (child.exitCode === null && child.signalCode === null) {
    const ended = once(child,'exit'); child.kill('SIGTERM');
    await Promise.race([ended,delay(1000)]);
    if (child.exitCode === null && child.signalCode === null) {child.kill('SIGKILL');await ended;}
  }
  fs.rmSync(temp,{recursive:true,force:true});
}
