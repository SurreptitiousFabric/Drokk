import { serviceCompatibility } from './service-compatibility.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { renderTemplate } from './render-template.mjs';

export function notificationPlugin(source, model, typography) {
  const upstream = path.join(source, 'upstream/omarchy-notifications');
  const provenance = JSON.parse(fs.readFileSync(path.join(upstream, 'provenance.json')));
  const originals = {};
  for (const [name, expected] of Object.entries(provenance.files)) {
    const bytes = fs.readFileSync(path.join(upstream, name));
    if (createHash('sha256').update(bytes).digest('hex') !== expected) throw new Error(`Upstream notification baseline changed: ${name}`);
    originals[name] = bytes.toString('utf8');
  }
  const anchor = '              glyph: cardSlot.glyph';
  if (originals['Service.qml'].split(anchor).length !== 2) throw new Error('Notification view binding no longer matches upstream');
  const binding = `${anchor}
              category: cardSlot.category
              iconResolver: function(name) { return Quickshell.iconPath(name, true) }
              actionLabel: {
                var entry = popupModel.get(cardSlot.index)
                if (entry && entry.exec) return ""
                var ref = entry && !service.isRestoredRow(entry) ? service.liveRefs[entry.originalId] : null
                if (!ref || !ref.actions) return ""
                for (var i = 0; i < ref.actions.length; i++)
                  if (ref.actions[i].identifier === "default") return String(ref.actions[i].text || "").trim()
                return ""
              }`;
  function replaceOnce(text, before, after) {
    if (text.split(before).length !== 2) throw new Error('Notification presentation anchor changed: ' + before);
    return text.replace(before, after);
  }
  let service = originals['Service.qml'].replace(anchor, binding);
  service = replaceOnce(service, 'required property string appIcon', 'required property string appIcon\n            required property string category');
  service = replaceOnce(service, 'anchors.topMargin: popupWindow.popupPlacement.margins.top', 'anchors.topMargin: service.barPosition === "top" ? service.liveBarSize + 38 : 38');
  service = replaceOnce(service, 'anchors.rightMargin: popupWindow.popupPlacement.margins.right', 'anchors.rightMargin: service.barPosition === "right" ? service.liveBarSize + 42 : 42');
  service = replaceOnce(service, 'spacing: Style.space(8)', 'spacing: 12');
  let logic = originals['NotificationLogic.js'];
  logic = replaceOnce(logic, 'appIcon: n.appIcon || "",', 'appIcon: n.appIcon || "",\n    category: stringHint(n.hints, "category"),');
  logic = replaceOnce(logic, 'appIcon: e.appIcon || "",', 'appIcon: e.appIcon || "",\n    category: e.category || "",');
  logic = replaceOnce(logic, '"app", "appIcon", "summary"', '"app", "appIcon", "category", "summary"');
  const card = renderTemplate(fs.readFileSync(path.join(source, 'plugins/megacity.notifications/components/NotificationCard.qml'), 'utf8'), model, typography);
  const result = {
    'Service.qml': service,
    'NotificationLogic.js': logic,
    'components/NotificationCard.qml': card,
    'upstream.json': JSON.stringify(provenance, null, 2) + '\n',
    'LICENSE': fs.readFileSync(path.join(upstream, 'LICENSE')),
  };
  const symbols = JSON.parse(fs.readFileSync(path.join(source, 'assets/symbols.json')));
  for (const [kind, symbol] of Object.entries({ download: 'download', success: 'network', warning: 'battery', error: 'info', 'battery-error': 'battery', info: 'info' })) {
    result[`components/icons/${kind}.svg`] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${model.colors.background}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${symbols[symbol]}"/></svg>\n`;
  }
  return serviceCompatibility(source, 'notifications', provenance, result);
}
