import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Keep the native menu's routes, providers, keyboard handling and actions.
// Only these explicit presentation bindings differ from the pinned upstream.
export function menuPluginFiles(source) {
  const directory = path.join(source, 'upstream/omarchy-menu');
  const provenance = JSON.parse(fs.readFileSync(path.join(directory, 'provenance.json')));
  const result = {};
  for (const [name, expected] of Object.entries(provenance.files)) {
    const bytes = fs.readFileSync(path.join(directory, name));
    if (createHash('sha256').update(bytes).digest('hex') !== expected) throw new Error(`Upstream menu baseline changed: ${name}`);
    result[name] = bytes.toString('utf8');
  }
  const changes = [
    ['readonly property int cornerRadius: Style.cornerRadius', 'readonly property int cornerRadius: 10'],
    ['property int contentMargin: Style.spacing.panelPadding', 'property int contentMargin: 14'],
    ['property int contentSpacing: Style.spacing.md', 'property int contentSpacing: 8'],
    ['property int baseRowHeight: Math.max(Style.space(50), Style.font.body + Style.spacing.rowPaddingX * 2)', 'property int baseRowHeight: Math.max(44, Style.font.body + 16)'],
    ['property int rowSpacing: Style.spacing.xs', 'property int rowSpacing: 7'],
    ['property int rowPeek: Math.round(baseRowHeight * 0.55)', 'property int rowPeek: 0'],
    ['? Style.space(520) : Style.space(300)', '? Style.space(520) : (root.activeMenu === "root" ? Style.space(300) : Style.space(360))'],
  ];
  for (const [before, after] of changes) {
    if (result['Menu.qml'].split(before).length !== 2) throw new Error(`Menu presentation anchor changed: ${before}`);
    result['Menu.qml'] = result['Menu.qml'].replace(before, after);
  }
  result['upstream.json'] = JSON.stringify(provenance, null, 2) + '\n';
  result.LICENSE = fs.readFileSync(path.join(directory, 'LICENSE'));
  return result;
}
