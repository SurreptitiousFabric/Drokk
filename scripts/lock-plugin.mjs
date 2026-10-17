import { serviceCompatibility } from './service-compatibility.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export function lockPluginFiles(source) {
  const directory = path.join(source, 'upstream/omarchy-lock');
  const provenance = JSON.parse(fs.readFileSync(path.join(directory, 'provenance.json')));
  const result = {};
  for (const [name, expected] of Object.entries(provenance.files)) {
    const bytes = fs.readFileSync(path.join(directory, name));
    if (createHash('sha256').update(bytes).digest('hex') !== expected) throw new Error(`Upstream lock baseline changed: ${name}`);
    result[name] = bytes.toString('utf8');
  }
  const replacements = [
    ['import QtQuick\n', 'import QtQuick\nimport Quickshell\n'],
    ['readonly property int fieldWidth: 381', 'readonly property int fieldWidth: Math.min(344, root.width - 32)'],
    ['readonly property int fieldHeight: 67', 'readonly property int fieldHeight: 50'],
    ['readonly property int outlineThickness: 3', 'readonly property int outlineThickness: 1'],
    ['      blur: 1.0', '      blur: 0.0'],
    ['      blurEnabled: root.loadBackground && wallpaper.status === Image.Ready', '      blurEnabled: false'],
    ['      contrast: -0.08', '      contrast: 0.0'],
    ['      blurMax: 128', '      blurMax: 16'],
    ['      anchors.centerIn: parent\n      color: Color.lock.background', '      anchors.horizontalCenter: parent.horizontalCenter\n      parent: composition\n      y: 335\n      color: Color.lock.background'],
    ['      radius: Style.cornerRadius', '      radius: 8'],
  ];
  let view = result['LockView.qml'];
  for (const [before, after] of replacements) {
    if (view.split(before).length !== 2) throw new Error(`Lock view anchor changed: ${before}`);
    view = view.replace(before, after);
  }
  const composition = fs.readFileSync(path.join(source, 'plugins/megacity.lock/Composition.qml.fragment'), 'utf8');
  const anchor = '    BorderSurface {\n      id: inputField';
  if (view.split(anchor).length !== 2) throw new Error('Lock input anchor changed');
  result['LockView.qml'] = view.replace(anchor, composition + '\n' + anchor);
  result['manifest.json'] = fs.readFileSync(path.join(source, 'plugins/megacity.lock/manifest.json'));
  result['lock-emblem.png'] = fs.readFileSync(path.join(source, 'assets/lock-emblem.png'));
  result['LICENSE'] = fs.readFileSync(path.join(directory, 'LICENSE'));
  result['upstream.json'] = JSON.stringify(provenance, null, 2) + '\n';
  return serviceCompatibility(source, 'lock', provenance, result);
}
