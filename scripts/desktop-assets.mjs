import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export function desktopAssets(model, folder, symbols) {
  const c = model.colors, out = {};
  const iconRoot = 'icons/Mega-City-One/';
  out[iconRoot + 'index.theme'] = '[Icon Theme]\nName=Mega-City One\nInherits=Yaru-blue,hicolor\nDirectories=scalable/places\n\n[scalable/places]\nSize=48\nType=Scalable\nMinSize=16\nMaxSize=256\nContext=Places\n';
  for (const name of ['folder', 'folder-open', 'folder-documents', 'folder-download', 'folder-downloads', 'folder-pictures', 'folder-music', 'folder-videos', 'folder-templates', 'folder-publicshare', 'user-home', 'user-desktop']) out[iconRoot + 'scalable/places/' + name + '.svg'] = folder;
  for (const name of ['folder-symbolic','folder-open-symbolic','folder-documents-symbolic','folder-download-symbolic','folder-pictures-symbolic','folder-music-symbolic','folder-videos-symbolic','user-home-symbolic','user-desktop-symbolic']) out[iconRoot + 'scalable/places/' + name + '.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${c.foreground}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${symbols.files}"/></svg>
`;
  out['icons.theme'] = 'Yaru-blue\n';
  const root = 'cursors/Mega-City-One/';
  out[root + 'index.theme'] = '[Icon Theme]\nName=Mega-City One\nInherits=Adwaita\n';
  const paths = {
    default: symbols.cursor,
    text: 'M12 3v18M8 3h8M8 21h8',
    pointer: 'M8 12V5a2 2 0 0 1 4 0v6-3a2 2 0 0 1 4 0v3-1a2 2 0 0 1 4 0v6l-3 6H9l-6-8a2 2 0 0 1 3-2l2 2z',
    move: 'M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4',
    'ew-resize': 'M2 12h20M6 8l-4 4 4 4M18 8l4 4-4 4',
    'ns-resize': 'M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4',
    'nwse-resize': 'M4 4l16 16M4 10V4h6M14 20h6v-6',
    'nesw-resize': 'M20 4 4 20M14 4h6v6M4 14v6h6',
    'not-allowed': 'M5 5l14 14M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20',
    crosshair: 'M12 1v8M12 15v8M1 12h8M15 12h8M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
  };
  const aliases = { default: ['left_ptr', 'arrow', 'top_left_arrow'], text: ['xterm', 'ibeam'], pointer: ['hand1', 'hand2', 'pointing_hand'], move: ['fleur', 'all-scroll', 'size_all'], 'ew-resize': ['h_double_arrow', 'sb_h_double_arrow', 'size_hor', 'col-resize', 'e-resize', 'w-resize', 'left_side', 'right_side'], 'ns-resize': ['v_double_arrow', 'sb_v_double_arrow', 'size_ver', 'row-resize', 'n-resize', 's-resize', 'top_side', 'bottom_side'], 'nwse-resize': ['size_fdiag', 'bd_double_arrow', 'nw-resize', 'se-resize', 'top_left_corner', 'bottom_right_corner'], 'nesw-resize': ['size_bdiag', 'fd_double_arrow', 'ne-resize', 'sw-resize', 'top_right_corner', 'bottom_left_corner'], 'not-allowed': ['forbidden', 'no-drop', 'crossed_circle'], crosshair: ['cross', 'cell', 'precision'], wait: ['watch', 'busy'], progress: ['left_ptr_watch', 'half-busy'] };
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'mega-city-cursor-'));
  const metadata = {};
  try {
    for (const name of [...Object.keys(paths), 'wait', 'progress']) {
      const animated = name === 'wait' || name === 'progress';
      const frames = animated ? 8 : 1;
      const config = [], previews = [];
      for (let frame = 0; frame < frames; frame++) {
        const shape = animated ? `<circle cx="12" cy="12" r="7" fill="none" stroke="${c.blue}" stroke-width="2.5"/><path d="M12 5a7 7 0 0 1 7 7" fill="none" stroke="${c['art.cursor']}" stroke-width="2.5" transform="rotate(${frame * 45} 12 12)"/>` : `<path d="${paths[name]}" fill="${['default', 'pointer'].includes(name) ? c.background : 'none'}" stroke="${c['art.cursor']}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>`;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${shape}</svg>`;
        previews.push(svg);
        for (const size of [16, 24, 32, 48]) {
          const png = path.join(temporary, `${name}-${size}-${frame}.png`);
          execFileSync('rsvg-convert', ['-w', String(size), '-h', String(size), '-o', png], { input: svg });
          const x = name === 'default' ? Math.round(size * 4 / 24) : name === 'pointer' ? Math.round(size * 10 / 24) : size / 2;
          const y = name === 'default' ? Math.round(size * 2 / 24) : name === 'pointer' ? Math.round(size * 4 / 24) : size / 2;
          config.push(`${size} ${x} ${y} ${png} ${animated ? 80 : 0}`);
        }
      }
      const configuration = path.join(temporary, name + '.cursor');
      fs.writeFileSync(configuration, config.join('\n') + '\n');
      const cursor = path.join(temporary, name + '.xcur');
      execFileSync('xcursorgen', [configuration, cursor]);
      const bytes = fs.readFileSync(cursor);
      for (const alias of [name, ...aliases[name]]) out[root + 'cursors/' + alias] = bytes;
      out[root + 'previews/' + name + '.svg'] = previews[0];
      metadata[name] = { sizes: [16, 24, 32, 48], frames, frameDelayMs: animated ? 80 : 0, aliases: aliases[name] };
    }
    out[root + 'states.json'] = JSON.stringify(metadata, null, 2) + '\n';
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
  return out;
}
