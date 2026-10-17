import test from 'node:test';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = path.resolve(import.meta.dirname, '..');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mega-city-theme-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const source = path.join(root, 'source');
  fs.cpSync(path.join(repo, 'theme/mega-city-one/source'), source, { recursive: true });
  return { root, source, out: path.join(root, 'package') };
}
function cli(...args) {
  return spawnSync(process.execPath, [path.join(repo, 'scripts/theme.mjs'), ...args], {
    encoding: 'utf8', timeout: 20000,
  });
}
function success(result) {
  assert.equal(result.status, 0, result.stderr || result.error?.message);
}

test('build exports a self-contained native palette, recolourable emblem and matching preview data', t => {
  const f = fixture(t);
  const modelPath = path.join(f.source, 'palette.json');
  const model = JSON.parse(fs.readFileSync(modelPath));
  model.colors.accent = '#115577';
  fs.writeFileSync(modelPath, JSON.stringify(model));
  const result = cli('build', '--source', f.source, '--out', f.out);
  success(result);
  const read = p => fs.readFileSync(path.join(f.out, p), 'utf8');
  assert.match(read('theme/colors.toml'), /^accent = "#115577"$/m);
  assert.match(read('theme/colors.toml'), /^selection_background = "#115577"$/m);
  assert.match(read('theme/assets/emblem.svg'), /fill="#115577"/);
  assert.equal(JSON.parse(read('preview/model.json')).colors.accent, '#115577');
  assert.equal(JSON.parse(read('preview/model.json')).colors['shell.menu.selected-background'], '#115577');
  assert.equal(fs.readFileSync(path.join(f.out, 'theme/backgrounds/mega-city-one.png')).subarray(1,4).toString(), 'PNG');
});

test('build applies native shell states and rejects unregistered controls without changing existing output', t => {
  const f = fixture(t);
  success(cli('build', '--source', f.source, '--out', f.out));
  const shellFile = path.join(f.out, 'theme/shell.toml');
  assert(fs.existsSync(shellFile), 'native shell theme must be emitted');
  const shell = fs.readFileSync(shellFile, 'utf8');
  assert.match(shell, /\[notifications\][\s\S]*?background-alpha = 0\.94/);
  assert.match(shell, /\[menu\][\s\S]*?selected-background = "#D1B472"/);
  assert.match(shell, /\[menu\][\s\S]*?selected-border = "#D3404B"/);
  const before = fs.readFileSync(path.join(f.out, 'manifest.json'));
  const p = path.join(f.source, 'palette.json'), model = JSON.parse(fs.readFileSync(p));
  model.colors['shell.imaginary.value'] = '#FFFFFF';
  fs.writeFileSync(p, JSON.stringify(model));
  const failed = cli('build', '--source', f.source, '--out', f.out);
  assert.notEqual(failed.status, 0);
  assert.match(failed.stderr, /Unsupported colour token: shell.imaginary.value/);
  assert.deepEqual(fs.readFileSync(path.join(f.out, 'manifest.json')), before);
});

test('build is reproducible and check rejects altered, extra and escaping package files', t => {
  const f = fixture(t);
  success(cli('build', '--source', f.source, '--out', f.out));
  const manifestPath = path.join(f.out, 'manifest.json');
  const first = fs.readFileSync(manifestPath);
  success(cli('build', '--source', f.source, '--out', f.out));
  assert.deepEqual(fs.readFileSync(manifestPath), first);
  success(cli('check', '--out', f.out));
  fs.appendFileSync(path.join(f.out, 'theme/colors.toml'), '\n# changed\n');
  const changed = cli('check', '--out', f.out);
  assert.notEqual(changed.status, 0);
  assert.match(changed.stderr, /Package file differs: theme\/colors.toml/);
  fs.rmSync(f.out, { recursive: true });
  success(cli('build', '--source', f.source, '--out', f.out));
  fs.writeFileSync(path.join(f.out, 'unexpected.txt'), 'unowned');
  const extra = cli('check', '--out', f.out);
  assert.notEqual(extra.status, 0);
  assert.match(extra.stderr, /Unexpected package file/);
  const unrelated = path.join(f.root, 'unrelated');
  fs.mkdirSync(unrelated);
  fs.writeFileSync(path.join(unrelated, 'keep'), 'user work');
  assert.notEqual(cli('build', '--source', f.source, '--out', unrelated).status, 0);
  assert.equal(fs.readFileSync(path.join(unrelated, 'keep'), 'utf8'), 'user work');
});

test('install dry-run makes no changes, reapply is idempotent, and remove restores the previous theme', t => {
  const f = fixture(t);
  success(cli('build', '--source', f.source, '--out', f.out));
  const home = path.join(f.root, 'home');
  const destination = path.join(home, '.config/omarchy/themes/mega-city-one');
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, 'old-theme.txt'), 'previous theme');
  const current = path.join(home, '.local/state/omarchy/current');
  fs.mkdirSync(current, { recursive: true });
  fs.symlinkSync('/some-existing-theme', path.join(current, 'theme'));
  success(cli('install', '--out', f.out, '--target-home', home, '--dry-run'));
  assert.deepEqual(fs.readdirSync(destination), ['old-theme.txt']);
  assert(!fs.existsSync(path.join(home, '.local/state/thememe')));
  success(cli('install', '--out', f.out, '--target-home', home));
  assert.match(fs.readFileSync(path.join(destination, 'colors.toml'), 'utf8'), /background = "#0E1822"/);
  success(cli('install', '--out', f.out, '--target-home', home));
  assert.equal(fs.readlinkSync(path.join(current, 'theme')), '/some-existing-theme');
  success(cli('remove', '--target-home', home));
  assert.deepEqual(fs.readdirSync(destination), ['old-theme.txt']);
  assert.equal(fs.readFileSync(path.join(destination, 'old-theme.txt'), 'utf8'), 'previous theme');
  success(cli('remove', '--target-home', home));
});

test('package updates retain the original backup and protect user changes to installed files and backups', t => {
  const f = fixture(t);
  const home = path.join(f.root, 'home'), dest = path.join(home, '.config/omarchy/themes/mega-city-one');
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'original'), 'original theme');
  success(cli('build', '--source', f.source, '--out', f.out));
  success(cli('install', '--out', f.out, '--target-home', home));
  const palette = path.join(f.source, 'palette.json'), model = JSON.parse(fs.readFileSync(palette));
  model.colors.accent = '#224466';
  fs.writeFileSync(palette, JSON.stringify(model));
  success(cli('build', '--source', f.source, '--out', f.out));
  success(cli('install', '--out', f.out, '--target-home', home));
  assert.match(fs.readFileSync(path.join(dest, 'colors.toml'), 'utf8'), /accent = "#224466"/);
  const installed = fs.readFileSync(path.join(dest, 'colors.toml'));
  fs.appendFileSync(path.join(dest, 'colors.toml'), '\n# user edit\n');
  const remove = cli('remove', '--target-home', home);
  assert.notEqual(remove.status, 0);
  assert.match(remove.stderr, /user changes/);
  assert.match(fs.readFileSync(path.join(dest, 'colors.toml'), 'utf8'), /user edit/);
  fs.writeFileSync(path.join(dest, 'colors.toml'), installed);
  const backup = path.join(home, '.local/state/thememe/mega-city-one/previous-theme/original');
  fs.writeFileSync(backup, 'modified backup');
  const corrupted = cli('remove', '--target-home', home);
  assert.notEqual(corrupted.status, 0);
  assert.match(corrupted.stderr, /backup has changed/);
  fs.writeFileSync(backup, 'original theme');
  success(cli('remove', '--target-home', home));
  assert.equal(fs.readFileSync(path.join(dest, 'original'), 'utf8'), 'original theme');
});

test('failed update preserves the installed theme and receipt without deleting prior transaction evidence', t => {
  const f = fixture(t), home = path.join(f.root, 'home');
  fs.mkdirSync(home);
  success(cli('build', '--source', f.source, '--out', f.out));
  success(cli('install', '--out', f.out, '--target-home', home));
  const dest = path.join(home, '.config/omarchy/themes/mega-city-one');
  const state = path.join(home, '.local/state/thememe/mega-city-one');
  const before = fs.readFileSync(path.join(dest, 'colors.toml'));
  const receipt = fs.readFileSync(path.join(state, 'receipt.json'));
  // An existing transaction file is a real filesystem failure, not a mocked collaborator.
  const interrupted = path.join(state, 'receipt.next.json');
  fs.writeFileSync(interrupted, 'preserve interrupted transaction');
  const p = path.join(f.source, 'palette.json'), model = JSON.parse(fs.readFileSync(p));
  model.colors.accent = '#335577';
  fs.writeFileSync(p, JSON.stringify(model));
  success(cli('build', '--source', f.source, '--out', f.out));
  const failed = cli('install', '--out', f.out, '--target-home', home);
  assert.notEqual(failed.status, 0);
  assert.deepEqual(fs.readFileSync(path.join(dest, 'colors.toml')), before);
  assert.deepEqual(fs.readFileSync(path.join(state, 'receipt.json')), receipt);
  assert.equal(fs.readFileSync(interrupted, 'utf8'), 'preserve interrupted transaction');
  fs.unlinkSync(interrupted);
  success(cli('remove', '--target-home', home));
  assert(!fs.existsSync(dest));
});

test('package carries font notices and a preview that remains usable without the design history', t => {
  const f = fixture(t);
  success(cli('build', '--source', f.source, '--out', f.out));
  fs.renameSync(f.source, path.join(f.root, 'source-unavailable'));
  success(cli('check', '--out', f.out));
  const read = p => fs.readFileSync(path.join(f.out, p), 'utf8');
  assert(fs.existsSync(path.join(f.out, 'theme/fonts/ShureTechMonoNerdFontMono-Regular.ttf')));
  assert.match(read('theme/fonts/ShureTechMono-OFL.txt'), /SIL OPEN FONT LICENSE/);
  assert.match(read('preview/index.html'), /ShureTechMonoNerdFontMono-Regular.ttf/);
  assert.match(read('preview/index.html'), /#0E1822/);
  assert(!read('preview/index.html').includes('output/'));
  const manifest = JSON.parse(read('manifest.json'));
  assert(manifest.dependencies.some(d => d.package === 'gsfonts'));
  const coverage = JSON.parse(read('preview/coverage.json'));
  assert.equal(coverage['editor.keyword'], 'native Neovim configuration; runtime unverified');
});

test('remove refuses redirected backups and preserves unrelated recovery files', t => {
  const f = fixture(t), home = path.join(f.root, 'home');
  const dest = path.join(home, '.config/omarchy/themes/mega-city-one');
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'old'), 'previous');
  success(cli('build', '--source', f.source, '--out', f.out));
  success(cli('install', '--out', f.out, '--target-home', home));
  const state = path.join(home, '.local/state/thememe/mega-city-one');
  const backup = path.join(state, 'previous-theme'), outside = path.join(f.root, 'redirected');
  fs.renameSync(backup, outside);
  fs.symlinkSync(outside, backup);
  const redirected = cli('remove', '--target-home', home);
  assert.notEqual(redirected.status, 0);
  assert.match(redirected.stderr, /symlink/);
  assert.equal(fs.readFileSync(path.join(outside, 'old'), 'utf8'), 'previous');
  fs.unlinkSync(backup);
  fs.renameSync(outside, backup);
  const note = path.join(state, 'keep.txt');
  fs.writeFileSync(note, 'recovery note');
  const unowned = cli('remove', '--target-home', home);
  assert.notEqual(unowned.status, 0);
  assert.match(unowned.stderr, /Unrecognised installation state/);
  assert.equal(fs.readFileSync(note, 'utf8'), 'recovery note');
  fs.unlinkSync(note);
  success(cli('remove', '--target-home', home));
});

test('invalid aliases, alpha and package paths cannot replace a valid package', t => {
  const f = fixture(t), p = path.join(f.source, 'palette.json');
  const original = fs.readFileSync(p);
  success(cli('build', '--source', f.source, '--out', f.out));
  const receipt = fs.readFileSync(path.join(f.out, 'manifest.json'));
  for (const [change, message] of [
    [m => { m.colors.accent = '$selection'; }, /Circular colour alias/],
    [m => { m.colors.accent = '$missing'; }, /Unknown colour/],
    [m => { m.alpha['shell.menu.background-alpha'] = 1.2; }, /Invalid alpha/],
  ]) {
    const model = JSON.parse(original); change(model); fs.writeFileSync(p, JSON.stringify(model));
    const result = cli('build', '--source', f.source, '--out', f.out);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, message);
    assert.deepEqual(fs.readFileSync(path.join(f.out, 'manifest.json')), receipt);
  }
  const manifest = JSON.parse(receipt);
  manifest.files[0].path = '../escape';
  fs.writeFileSync(path.join(f.out, 'manifest.json'), JSON.stringify(manifest));
  const unsafe = cli('check', '--out', f.out);
  assert.notEqual(unsafe.status, 0);
  assert.match(unsafe.stderr, /Unsafe package path/);
});

test('check refuses an empty theme payload even when its manifest is well formed', t => {
  const f = fixture(t);
  fs.mkdirSync(f.out);
  fs.writeFileSync(path.join(f.out, 'manifest.json'), JSON.stringify({ schemaVersion: 1, name: 'mega-city-one', files: [] }));
  const result = cli('check', '--out', f.out);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing required package file/);
});

test('terminal adapters share the full ANSI palette, regular Share Tech faces and background-only alpha', t => {
  const f = fixture(t);
  const p = path.join(f.source, 'palette.json'), model = JSON.parse(fs.readFileSync(p));
  model.colors.background = '#101820';
  model.colors.magenta = '#AABBCC';
  model.colors['terminal.cursor'] = '#CCDD11';
  model.alpha['effects.terminal-background-alpha'] = 0.87;
  fs.writeFileSync(p, JSON.stringify(model));
  success(cli('build', '--source', f.source, '--out', f.out));
  const read = p => fs.readFileSync(path.join(f.out, 'theme', p), 'utf8');
  assert.match(read('foot.ini'), /regular5=AABBCC/);
  assert.match(read('foot.ini'), /bright7=FFFFFF/);
  assert.match(read('foot.ini'), /alpha=0\.87/);
  assert.match(read('foot.ini'), /alpha-mode=default/);
  assert.match(read('foot.ini'), /font=ShureTechMono Nerd Font Mono:pixelsize=16/);
  assert.match(read('foot.ini'), /font-bold=ShureTechMono Nerd Font Mono:pixelsize=16/);
  assert.match(read('ghostty.conf'), /palette = 5=#AABBCC/);
  assert.match(read('ghostty.conf'), /background-opacity = 0\.87/);
  assert.match(read('kitty.conf'), /color5 #AABBCC/);
  assert.match(read('kitty.conf'), /background_opacity 0\.87/);
  assert.match(read('alacritty.toml'), /magenta = "#AABBCC"/);
  assert.match(read('alacritty.toml'), /opacity = 0\.87/);
  assert.match(read('alacritty.toml'), /cursor = "#CCDD11"/);
});

test('native desktop adapters honour border, graph, syntax and font sources', t => {
  const f = fixture(t);
  const p = path.join(f.source, 'palette.json'), model = JSON.parse(fs.readFileSync(p));
  model.colors.hyprland_active_border = '#123456';
  model.colors['monitor.current'] = '#223344';
  model.colors['editor.keyword'] = '#334455';
  fs.writeFileSync(p, JSON.stringify(model));
  success(cli('build', '--source', f.source, '--out', f.out));
  const read = p => fs.readFileSync(path.join(f.out, 'theme', p), 'utf8');
  assert.match(read('hyprland.lua'), /rgba\(123456ff\)/i);
  assert.match(read('hyprland.lua'), /opacity = "1 1"/);
  assert.match(read('btop.theme'), /theme\[cpu_mid\]="#223344"/);
  assert.match(read('btop.theme'), /theme\[selected_fg\]="#0E1822"/);
  assert.match(read('neovim.lua'), /#334455/);
  assert.match(read('neovim.lua'), /on_highlights/);
  assert.match(read('fonts.conf'), /<dir prefix="relative">fonts<\/dir>/);
});

test('GTK, Qt, Yazi and browser chrome exports follow shared semantic roles', t => {
  const f = fixture(t), p = path.join(f.source, 'palette.json');
  const model = JSON.parse(fs.readFileSync(p));
  model.colors['gtk.background'] = '#102030';
  model.colors['gtk.selection'] = '#A1B2C3';
  model.colors['qt.background'] = '#203040';
  model.colors['browser.toolbar'] = '#304050';
  model.colors['browser.tabActive'] = '#405060';
  model.colors['browser.address'] = '#506070';
  fs.writeFileSync(p, JSON.stringify(model));
  success(cli('build', '--source', f.source, '--out', f.out));
  const read = p => fs.readFileSync(path.join(f.out, 'theme', p), 'utf8');
  assert.match(read('gtk-4.0.css'), /#102030/);
  assert.match(read('gtk-3.0.css'), /#A1B2C3/);
  assert(!read('gtk-4.0.css').includes('rgba('), 'Files surface stays solid');
  assert.match(read('qt.qss'), /#203040/);
  assert.match(read('yazi-theme.toml'), /\[indicator\]/);
  assert.match(read('yazi-theme.toml'), /bg = "#D1B472"/);
  const browser = JSON.parse(read('chromium-extension/manifest.json'));
  assert.deepEqual(browser.theme.colors.toolbar, [48, 64, 80]);
  assert.deepEqual(browser.theme.colors.tab_background_text, [232, 238, 244]);
  assert.deepEqual(browser.theme.colors.frame, [14, 24, 34]);
  assert.deepEqual(browser.theme.colors.frame_inactive, [14, 23, 33]);
  assert.deepEqual(browser.theme.colors.tab_text, [232, 238, 244]);
  assert.deepEqual(browser.theme.colors.omnibox_background, [80, 96, 112]);
});

test('font configuration is reversible, preserves unrelated Foot settings and blocks removing its font directory', t => {
  const f = fixture(t), home = path.join(f.root, 'home');
  const foot = path.join(home, '.config/foot/foot.ini');
  fs.mkdirSync(path.dirname(foot), { recursive: true });
  const original = '[main]\nfont=JetBrainsMono Nerd Font:size=9\npad=14x14\n\n[key-bindings]\nclipboard-copy=Control+Insert\n';
  fs.writeFileSync(foot, original);
  success(cli('build', '--source', f.source, '--out', f.out));
  success(cli('install', '--out', f.out, '--target-home', home));
  success(cli('configure', '--out', f.out, '--target-home', home, '--dry-run'));
  assert.equal(fs.readFileSync(foot, 'utf8'), original);
  success(cli('configure', '--out', f.out, '--target-home', home));
  const configured = fs.readFileSync(foot, 'utf8');
  assert.match(configured, /font=ShureTechMono Nerd Font Mono:pixelsize=16/);
  assert.match(configured, /font-bold=ShureTechMono Nerd Font Mono:pixelsize=16/);
  assert.match(configured, /pad=14x14/);
  assert.match(configured, /clipboard-copy=Control\+Insert/);
  const fontconfig = path.join(home, '.config/fontconfig/conf.d/99-mega-city-one.conf');
  assert.match(fs.readFileSync(fontconfig, 'utf8'), /\/themes\/mega-city-one\/fonts/);
  assert.notEqual(cli('remove', '--target-home', home).status, 0);
  success(cli('unconfigure', '--target-home', home));
  assert.equal(fs.readFileSync(foot, 'utf8'), original);
  assert(!fs.existsSync(fontconfig));
  success(cli('remove', '--target-home', home));
});

test('font restoration refuses later user edits and leaves its backups intact', t => {
  const f = fixture(t), home = path.join(f.root, 'home');
  const foot = path.join(home, '.config/foot/foot.ini');
  fs.mkdirSync(path.dirname(foot), { recursive: true });
  const original = '[main]\nfont=monospace:size=10\n';
  fs.writeFileSync(foot, original);
  success(cli('build', '--source', f.source, '--out', f.out));
  success(cli('install', '--out', f.out, '--target-home', home));
  success(cli('configure', '--out', f.out, '--target-home', home));
  const configured = fs.readFileSync(foot);
  const state = path.join(home, '.local/state/thememe/mega-city-one-settings');
  const receipt = fs.readFileSync(path.join(state, 'receipt.json'));
  fs.appendFileSync(foot, '\n# user change\n');
  const blocked = cli('unconfigure', '--target-home', home);
  assert.notEqual(blocked.status, 0);
  assert.match(blocked.stderr, /user changes/);
  assert.match(fs.readFileSync(foot, 'utf8'), /user change/);
  assert.equal(fs.readFileSync(path.join(state, 'backup-0'), 'utf8'), original);
  assert.deepEqual(fs.readFileSync(path.join(state, 'receipt.json')), receipt);
  fs.writeFileSync(foot, configured);
  success(cli('unconfigure', '--target-home', home));
  assert.equal(fs.readFileSync(foot, 'utf8'), original);
  success(cli('remove', '--target-home', home));
});

test('configuration restores existing font registration bytes and original file modes', t => {
  const f = fixture(t), home = path.join(f.root, 'home');
  const foot = path.join(home, '.config/foot/foot.ini');
  const fonts = path.join(home, '.config/fontconfig/conf.d/99-mega-city-one.conf');
  fs.mkdirSync(path.dirname(foot), { recursive: true });
  fs.mkdirSync(path.dirname(fonts), { recursive: true });
  fs.writeFileSync(foot, '[main]\nfont=monospace:size=9\n');
  fs.writeFileSync(fonts, '<fontconfig><!-- original registry --></fontconfig>\n');
  fs.chmodSync(foot, 0o664);
  fs.chmodSync(fonts, 0o640);
  const before = [fs.readFileSync(foot), fs.readFileSync(fonts)];
  success(cli('build', '--source', f.source, '--out', f.out));
  success(cli('install', '--out', f.out, '--target-home', home));
  success(cli('configure', '--out', f.out, '--target-home', home));
  assert.equal(fs.statSync(foot).mode & 0o777, 0o664);
  assert.equal(fs.statSync(fonts).mode & 0o777, 0o640);
  success(cli('unconfigure', '--target-home', home));
  assert.deepEqual(fs.readFileSync(foot), before[0]);
  assert.deepEqual(fs.readFileSync(fonts), before[1]);
  assert.equal(fs.statSync(foot).mode & 0o777, 0o664);
  assert.equal(fs.statSync(fonts).mode & 0o777, 0o640);
  success(cli('remove', '--target-home', home));
});

test('font restoration refuses a redirected ownership receipt without changing configured files', t => {
  const f = fixture(t), home = path.join(f.root, 'home');
  fs.mkdirSync(home);
  success(cli('build', '--source', f.source, '--out', f.out));
  success(cli('install', '--out', f.out, '--target-home', home));
  success(cli('configure', '--out', f.out, '--target-home', home));
  const receipt = path.join(home, '.local/state/thememe/mega-city-one-settings/receipt.json');
  const saved = path.join(f.root, 'original-receipt.json');
  const foot = path.join(home, '.config/foot/foot.ini');
  const before = fs.readFileSync(foot);
  fs.renameSync(receipt, saved);
  fs.symlinkSync(saved, receipt);
  const refused = cli('unconfigure', '--target-home', home);
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /symlink/i);
  assert.deepEqual(fs.readFileSync(foot), before);
  assert(fs.lstatSync(receipt).isSymbolicLink());
  fs.unlinkSync(receipt);
  fs.renameSync(saved, receipt);
  success(cli('unconfigure', '--target-home', home));
  success(cli('remove', '--target-home', home));
});

test('optional eagle widget is built separately from the ordinary theme and uses its canonical emblem', t => {
  const f = fixture(t);
  success(cli('build', '--source', f.source, '--out', f.out));
  const destination = path.join(f.out, 'plugins/megacity.menu');
  const manifest = JSON.parse(fs.readFileSync(path.join(destination, 'manifest.json')));
  assert.equal(manifest.id, 'megacity.menu');
  assert.deepEqual(manifest.kinds, ['menu', 'bar-widget']);
  assert.equal(manifest.omarchy.clonedFrom, 'omarchy.menu');
  assert.deepEqual(fs.readFileSync(path.join(destination, 'emblem.svg')), fs.readFileSync(path.join(f.out, 'theme/assets/emblem.svg')));
  assert(!fs.existsSync(path.join(f.out, 'theme/plugins')));
});

test('notification companion preserves pinned upstream logic and separates presentation from the normal theme', t => {
  const f = fixture(t);
  success(cli('build', '--source', f.source, '--out', f.out));
  const plugin = path.join(f.out, 'plugins/megacity.notifications');
  const manifest = JSON.parse(fs.readFileSync(path.join(plugin, 'manifest.json')));
  assert.equal(manifest.omarchy.clonedFrom, 'omarchy.notifications');
  const logic = createRequire(import.meta.url)(path.join(plugin, 'NotificationLogic.js'));
  const row = logic.snapshotOf({ id: 12, appName: 'fixture', hints: { category: 'transfer.complete' } }, 100);
  assert.equal(row.category, 'transfer.complete');
  assert.equal(logic.parsePopupFiles(logic.serializePopup(row, 1), 1)[0].category, 'transfer.complete');
  assert.equal(logic.historyEntry(row, 1).category, 'transfer.complete');
  assert(!fs.readFileSync(path.join(plugin, 'components/NotificationCard.qml'), 'utf8').includes('@@'));
  assert(!fs.existsSync(path.join(f.out, 'theme/plugins')));
});

test('shared compact menu preserves native routes and application logic', t => {
  const f = fixture(t);
  success(cli('build', '--source', f.source, '--out', f.out));
  const plugin = path.join(f.out, 'plugins/megacity.menu');
  assert.deepEqual(fs.readFileSync(path.join(plugin, 'MenuModel.js')), fs.readFileSync(path.join(f.source, 'upstream/omarchy-menu/MenuModel.js')));
  const qml = fs.readFileSync(path.join(plugin, 'Menu.qml'), 'utf8');
  assert.match(qml, /readonly property int cornerRadius: 10/);
  assert.match(qml, /root.openRoute(payload.initialMenu || payload.menu || "root")/);
  assert(!fs.existsSync(path.join(f.out, 'plugins/megacity.launcher')));
});

test('login package preserves the exact approved art and is separate from normal theme installation', t => {
  const f = fixture(t);
  success(cli('build', '--source', f.source, '--out', f.out));
  assert.equal(createHash('sha256').update(fs.readFileSync(path.join(f.source, 'assets/login-reference.png'))).digest('hex'), 'fa6043805223a95a49a4fb82e34ea9a0c572a644ad47501804ed7f00c1b4c5b2');
  assert.deepEqual(fs.readFileSync(path.join(f.out, 'sddm/mega-city-one/background.png')), fs.readFileSync(path.join(f.source, 'assets/login-reference.png')));
  assert(fs.existsSync(path.join(f.out, 'sddm/mega-city-one/Main.qml')));
  assert(!fs.existsSync(path.join(f.out, 'theme/sddm')));
});

test('lock package retains exact original artwork and native authentication service', t => {
  const f = fixture(t);
  success(cli('build', '--source', f.source, '--out', f.out));
  const plugin = path.join(f.out, 'plugins/megacity.lock');
  assert.equal(createHash('sha256').update(fs.readFileSync(path.join(f.source, 'assets/lock-reference.png'))).digest('hex'), '8b8edaeaa2f8964b1701b140966a5336fc840b3abe3e9c712fba5fb8dfb107c1');
  assert.deepEqual(fs.readFileSync(path.join(plugin, 'NativeService.qml')), fs.readFileSync(path.join(f.source, 'upstream/omarchy-lock/Service.qml')));
  assert.deepEqual(fs.readFileSync(path.join(plugin, 'lock-emblem.png')), fs.readFileSync(path.join(f.source, 'assets/lock-emblem.png')));
});

test('folder overlay and complete cursor states are generated from shared sources', t => {
  const f = fixture(t);
  success(cli('build', '--source', f.source, '--out', f.out));
  assert.deepEqual(fs.readFileSync(path.join(f.out, 'theme/icons/Mega-City-One/scalable/places/folder.svg')), fs.readFileSync(path.join(f.out, 'theme/assets/folder.svg')));
  const base = path.join(f.out, 'theme/cursors/Mega-City-One');
  const states = JSON.parse(fs.readFileSync(path.join(base, 'states.json')));
  for (const name of ['default','text','pointer','move','ew-resize','ns-resize','nwse-resize','nesw-resize','not-allowed','crosshair','wait','progress']) {
    assert.deepEqual(states[name].sizes, [16,24,32,48]);
    assert.equal(fs.readFileSync(path.join(base, 'cursors', name)).subarray(0,4).toString(), 'Xcur');
  }
  assert.equal(states.wait.frames, 8);
});

test('ordinary theme installation selects stock icons without requiring optional asset registration', t => {
  const f=fixture(t);success(cli('build','--source',f.source,'--out',f.out));
  assert.equal(fs.readFileSync(path.join(f.out,'theme/icons.theme'),'utf8'),'Yaru-blue\n');
});
