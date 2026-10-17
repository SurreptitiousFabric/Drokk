import fs from 'node:fs';
import path from 'node:path';

// Exact tested versions deliberately fail closed until another baseline is accepted.
export function serviceCompatibility(source, kind, provenance, files) {
  const { packages } = JSON.parse(fs.readFileSync(path.join(source, 'compatibility.json')));
  if (!['lock', 'notifications'].includes(kind) || !Array.isArray(packages) || !packages.length || packages.some(p => !/^[a-z0-9+_.-]+ [a-zA-Z0-9+:_.~-]+$/.test(p))) throw new Error('Invalid service compatibility baseline');
  const checks = Object.entries(provenance.files).map(([name, sha]) => {
    if (!/^[a-zA-Z0-9_.-]+$/.test(name) || !/^[a-f0-9]{64}$/.test(sha)) throw new Error('Invalid native service fingerprint');
    return `[[ $(sha256sum -- "$host/shell/plugins/${kind}/${name}") == '${sha}  '"$host/shell/plugins/${kind}/${name}" ]]`;
  });
  return { ...files,
    'NativeService.qml': files['Service.qml'],
    'compatibility.json': JSON.stringify({ packages, native: provenance }, null, 2) + '\n',
    'compatibility.sh': `#!/usr/bin/bash
set -euo pipefail
host=\${1:?Expected installed Omarchy root}
[[ $host == /* && -d $host ]]
[[ $(pacman -Q ${packages.map(p => p.split(' ')[0]).join(' ')}) == '${packages.join('\n')}' ]]
${checks.join('\n')}
`,
    'Service.qml': `import QtQuick
import Quickshell
import Quickshell.Io

Item {
  id: root
  property var shell: null
  property string omarchyPath: Quickshell.env("OMARCHY_PATH")
  ${kind === "notifications" ? `readonly property bool doNotDisturb: service.item ? service.item.doNotDisturb : false
  function setDoNotDisturb(value) { if (service.item) service.item.setDoNotDisturb(value) }` : ""}
  property bool resolved: false
  property bool usingCustom: false
  function loadService(compatible) {
    if (resolved) return
    resolved = true
    watchdog.stop()
    setService(compatible)
  }
  function setService(compatible) {
    usingCustom = compatible
    if (!compatible) console.warn("Mega-City One ${kind}: unsupported host; using installed stock service")
    service.setSource(compatible ? Qt.resolvedUrl("NativeService.qml") : "file://" + root.omarchyPath + "/shell/plugins/${kind}/Service.qml", {
      shell: Qt.binding(function() { return root.shell }),
      omarchyPath: Qt.binding(function() { return root.omarchyPath })
    })
  }
  Loader {
    id: service
    onStatusChanged: if (status === Loader.Error && root.usingCustom) {
      console.warn("Mega-City One ${kind}: custom service failed; using installed stock service")
      Qt.callLater(function() { root.setService(false) })
    }
  }
  Process {
    id: check
    command: ["/usr/bin/bash", decodeURIComponent(Qt.resolvedUrl("compatibility.sh").toString().slice(7)), root.omarchyPath]
    onExited: function(code, status) { root.loadService(code === 0 && status === 0) }
  }
  Timer { id: watchdog; interval: 3000; onTriggered: { root.loadService(false); check.running = false } }
  Component.onCompleted: Qt.callLater(function() { watchdog.start(); check.running = true })
}
` };
}
