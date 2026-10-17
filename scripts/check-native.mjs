import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { checkPackage } from './build-theme.mjs';

const root = path.resolve(process.argv[2] ?? 'dist/mega-city-one');
const aether = process.env.THEMEME_AETHER_PATH ?? path.join(os.homedir(), '.local/share/nvim/lazy/aether.nvim');
checkPackage(root);
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'mega-city-native-'));
const env = { ...process.env, HOME: temporary, XDG_CONFIG_HOME: path.join(temporary, 'config'), XDG_DATA_HOME: path.join(temporary, 'data'), XDG_STATE_HOME: path.join(temporary, 'state'), XDG_CACHE_HOME: path.join(temporary, 'cache'), FONTCONFIG_FILE: path.join(root, 'theme/fonts.conf'), THEMEME_AETHER_PATH: aether };
function run(command, args, overrides = {}, stdoutOnly = false) {
  const result = spawnSync(command, args, { env: { ...env, ...overrides }, encoding: 'utf8', timeout: 5000, maxBuffer: 1024 * 1024 });
  if (result.status !== 0) throw new Error(`${command} native check failed: ${result.error?.message ?? result.stderr ?? result.status}`);
  return stdoutOnly ? result.stdout : result.stdout + result.stderr;
}
try {
  run('foot', ['--check-config', '--config', path.join(root, 'theme/foot.ini')]);
  run('ghostty', ['+validate-config', '--config-file=' + path.join(root, 'theme/ghostty.conf')]);
  run('Hyprland', ['--verify-config', '--config', path.join(root, 'theme/hyprland.lua')]);
  const font = run('fc-match', ['-f', '%{file}', 'ShureTechMono Nerd Font Mono']).trim();
  assert.equal(fs.realpathSync(font), fs.realpathSync(path.join(root, 'theme/fonts/ShureTechMonoNerdFontMono-Regular.ttf')));
  const output = run('nvim', ['--headless', '-u', 'NONE', '-i', 'NONE', '-l', path.join(import.meta.dirname, 'check-neovim.lua'), root]);
  const highlights = JSON.parse(output.trim());
  const model = JSON.parse(fs.readFileSync(path.join(root, 'preview/model.json'))).colors;
  const colour = hex => Number.parseInt(hex.slice(1), 16);
  for (const [group, token] of Object.entries({ Keyword: 'editor.keyword', String: 'editor.string', Comment: 'editor.comment', Number: 'editor.number', DiagnosticError: 'status.error' })) {
    assert.equal(highlights[group].fg, colour(model[token]), `${group} uses the shared colour`);
    assert(!highlights[group].bold && !highlights[group].italic, `${group} does not require synthetic faces`);
  }
  assert.equal(highlights.Normal.bg, colour(model.background));
  assert.equal(highlights.Visual.bg, colour(model.selection_background));
  assert.equal(highlights.Visual.fg, colour(model.selection_foreground));
  for (const version of ['3', '4']) {
    const checked = JSON.parse(run('python', [path.join(import.meta.dirname, 'check-gtk-css.py'), version, path.join(root, `theme/gtk-${version}.0.css`)], { GTK_A11Y: "none", NO_AT_BRIDGE: "1" }, true));
    assert.deepEqual(checked.errors, []);
    assert.equal(checked.windowCreated, false);
  }
  run('python', ['-c', 'import sys,tomllib; tomllib.load(open(sys.argv[1], "rb"))', path.join(root, 'theme/yazi-theme.toml')]);
  const home = path.join(temporary, 'fixture-home');
  fs.mkdirSync(path.join(home, '.config/foot'), { recursive: true });
  const originalFoot = '[main]\nfont=monospace:size=9\npad=14x14\n';
  fs.writeFileSync(path.join(home, '.config/foot/foot.ini'), originalFoot);
  const cli = (command) => run(process.execPath, [path.join(import.meta.dirname, 'theme.mjs'), command, '--out', root, '--target-home', home], { HOME: os.homedir() });
  cli('install');
  cli('configure');
  const configuredEnv = { HOME: home, XDG_CONFIG_HOME: path.join(home, '.config'), XDG_CACHE_HOME: path.join(home, '.cache'), FONTCONFIG_FILE: '/etc/fonts/fonts.conf' };
  const discovered = run('fc-match', ['-f', '%{file}', 'ShureTechMono Nerd Font Mono'], configuredEnv).trim();
  assert.equal(fs.realpathSync(discovered), fs.realpathSync(path.join(home, '.config/omarchy/themes/mega-city-one/fonts/ShureTechMonoNerdFontMono-Regular.ttf')));
  run('foot', ['--check-config', '--config', path.join(home, '.config/foot/foot.ini')], configuredEnv);
  cli('unconfigure');
  assert.equal(fs.readFileSync(path.join(home, '.config/foot/foot.ini'), 'utf8'), originalFoot);
  cli('remove');
  console.log('Native checks passed: Foot, Ghostty, Hyprland config; package font resolution; Neovim/Aether highlights; GTK3/GTK4 CSS; Yazi TOML syntax; fixture font adoption and restoration.');
  console.log('Not desktop acceptance: no app window, btop/Files/Qt/browser appearance, lock/login or host activation tested.');
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
