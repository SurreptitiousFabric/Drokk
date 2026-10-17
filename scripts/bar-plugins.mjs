import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export function barPlugins(source) {
  const base = path.join(source, 'upstream/omarchy-status');
  const provenance = JSON.parse(fs.readFileSync(path.join(base, 'provenance.json')));
  for (const [name, expected] of Object.entries(provenance.files)) if (createHash('sha256').update(fs.readFileSync(path.join(base, name))).digest('hex') !== expected) throw new Error('Stock status baseline changed: ' + name);
  const out = {};
  const colors = {
    audio: '!root.hasOutput ? Color.muted : root.outputMuted ? Color.foreground : Color.accent',
    network: 'root.kind === "disconnected" ? Color.foreground : Color.accent',
    bluetooth: '!root.adapter ? Color.muted : root.adapter.enabled ? Color.accent : Color.foreground',
    power: 'root.batteryPresent && root.discharging && root.batteryFraction <= 0.20 ? Color.urgent : Color.foreground',
  };
  for (const [id, expression] of Object.entries(colors)) {
    const manifest = JSON.parse(fs.readFileSync(path.join(base, id, 'manifest.json')));
    manifest.id = 'megacity.' + id; manifest.name = 'Mega-City One ' + id;
    manifest.version = '0.1.0'; manifest.omarchy = { clonedFrom: 'omarchy.' + id };
    let view = fs.readFileSync(path.join(base, id, 'Panel.qml'), 'utf8');
    const anchor = '    id: button\n';
    if (view.split(anchor).length !== 2) throw new Error('Status button anchor changed: ' + id);
    view = view.replace(anchor, anchor + '    foreground: ' + expression + '\n');
    const prefix = 'plugins/megacity.' + id + '/';
    out[prefix+'manifest.json'] = JSON.stringify(manifest,null,2)+'\n';
    out[prefix+'Panel.qml'] = view;
    out[prefix+'Model.js'] = fs.readFileSync(path.join(base,id,'Model.js'));
    out[prefix+'LICENSE'] = fs.readFileSync(path.join(base,'LICENSE'));
    out[prefix+'upstream.json'] = JSON.stringify(provenance,null,2)+'\n';
  }
  return out;
}
