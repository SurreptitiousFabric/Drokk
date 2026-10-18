import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { buildTheme, sourceDirectory, packageFiles, resolveModel } from './build-theme.mjs';

export function buildVariant(source, out) {
  source = path.resolve(source); out = path.resolve(out);
  for (const input of [source, sourceDirectory]) {
    if (out === input || out.startsWith(input + path.sep) || input.startsWith(out + path.sep)) throw new Error('Variant output must not overlap source');
  }
  const variant = JSON.parse(fs.readFileSync(path.join(source, 'variant.json')));
  if (!['brit-cit', 'judge-death', 'east-meg'].includes(variant.id)) throw new Error('Unsupported variant');
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'drokk-source-'));
  try {
    const merged = path.join(temporary, 'source');
    fs.cpSync(sourceDirectory, merged, { recursive: true });
    const palettePath = path.join(merged, 'palette.json');
    const palette = JSON.parse(fs.readFileSync(palettePath));
    Object.assign(palette.colors, variant.colors);
    Object.assign(palette.alpha, variant.alpha ?? {});
    fs.writeFileSync(palettePath, JSON.stringify(palette));
    for (const name of packageFiles(path.join(source, 'assets'))) {
      fs.copyFileSync(path.join(source, 'assets', name), path.join(merged, 'assets', name));
    }
    const colors = resolveModel(merged).colors;
    const emblemPath = path.join(merged, 'assets/emblem.source.svg');
    const fragment = fs.readFileSync(emblemPath, 'utf8').replace(/@@color:([^@]+)@@/g, (_, id) => colors[id]);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 100 100">' + fragment + '</svg>';
    const rendered = spawnSync('rsvg-convert', [], { input: svg, timeout: 5000, maxBuffer: 8 * 1024 * 1024 });
    if (rendered.status !== 0) throw new Error('Variant emblem rendering requires rsvg-convert: ' + (rendered.error?.message ?? rendered.stderr));
    fs.writeFileSync(emblemPath, '<image width="100" height="100" href="data:image/png;base64,' + rendered.stdout.toString('base64') + '"/>');
    const settingsPath = path.join(merged, 'shell-settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath));
    Object.assign(settings.bar, variant.shell?.bar ?? {});
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
    const metadataPath = path.join(merged, 'sddm/metadata.desktop');
    const metadata = fs.readFileSync(metadataPath, 'utf8').replaceAll('Mega-City One', variant.name).replace('Original approved eagle artwork', 'Selected ' + variant.name + ' artwork').replace('Theme-Id=mega-city-one', 'Theme-Id=' + variant.id);
    fs.writeFileSync(metadataPath, metadata);
    const mainPath = path.join(merged, 'sddm/Main.qml');
    let main = fs.readFileSync(mainPath, 'utf8');
    if (!main.includes('id: form; x: 641; y: 273')) throw new Error('Shared login geometry changed');
    main = main.replace('id: form; x: 641; y: 273', variant.id === 'judge-death' ? 'id: form; x: 416; y: 605' : variant.id === 'east-meg' ? 'id: form; x: 641; y: 273' : 'id: form; x: 666; y: 303; scale: 0.87; transformOrigin: Item.TopLeft');
    fs.writeFileSync(mainPath, main);
    const formPath = path.join(merged, 'sddm/LoginForm.qml');
    let form = fs.readFileSync(formPath, 'utf8');
    if (!form.includes('sourceClipRect: Qt.rect(826, 350, 20, 28)')) throw new Error('Shared login emblem anchor changed');
    form = form.replace('source: "background.png"; sourceClipRect: Qt.rect(826, 350, 20, 28)', 'source: "data:image/png;base64,' + fs.readFileSync(path.join(source, 'assets/lock-emblem.png')).toString('base64') + '"');
    if (variant.id === 'judge-death') {
      const placements = [
        ['width: 390; height: 369', 'width: 840; height: 145'],
        ['y: 20', 'y: 0'], ['y: 53', 'y: 28'],
        ['x: 25; y: 91', 'x: 225; y: 47'], ['x: 225; y: 91', 'x: 475; y: 47'],
        ['x: 185; y: 78; width: 20; height: 28', 'x: 410; y: 37; width: 20; height: 20'],
        ['x: 25; y: 125; width: 340; height: 40', 'x: 20; y: 60; width: 255; height: 36'],
        ['x: 25; y: 177; width: 340; height: 42', 'x: 290; y: 60; width: 255; height: 36'],
        ['x: 25; y: 239; width: 340; height: 43', 'x: 560; y: 60; width: 260; height: 36'],
        ['x: 25; y: 316', 'x: 20; y: 111'],
        ['x: 132; y: 306; width: 233; height: 35', 'x: 100; y: 103; width: 255; height: 30'],
        ['x: 25; y: 285; width: 340; height: 20', 'x: 390; y: 111; width: 430; height: 20'],
        ['JUSTICE DEPARTMENT', 'DARK JUDGES'],
      ];
      for (const [before, after] of placements) {
        if (form.split(before).length !== 2) throw new Error('Shared login layout anchor changed: ' + before);
        form = form.replace(before, after);
      }
    }
    fs.writeFileSync(formPath, form);
    return buildTheme(merged, out, variant.id);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const id = process.argv[2] ?? 'brit-cit';
    if (!['brit-cit', 'judge-death', 'east-meg'].includes(id)) throw new Error('Unsupported variant');
    const manifest = buildVariant(path.resolve('theme/' + id + '/source'), path.resolve('dist/' + id));
    console.log(`build: ${manifest.name}, ${manifest.files.length} files`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
