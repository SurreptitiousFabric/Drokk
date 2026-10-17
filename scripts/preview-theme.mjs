const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

export function previewTheme(model, typography) {
  const c = model.colors;
  const swatches = Object.entries(c).map(([id, value]) =>
    `<li><span style="background:${value}"></span><code>${escape(id)}</code><b>${value}</b></li>`).join('');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>Mega-City One package preview</title>
<style>
@font-face{font-family:ThemeMono;src:url('../theme/fonts/ShureTechMonoNerdFontMono-Regular.ttf')}
@font-face{font-family:ThemeInterface;src:url('../theme/fonts/PlexSans-Variable.ttf');font-weight:100 900}
*{box-sizing:border-box}body{background:${c.darker_background};color:${c.foreground};font:16px/1.5 ThemeInterface,sans-serif;margin:32px}
h1,h2{color:${c.accent}}main{max-width:1200px;margin:auto}section{background:${c.background};padding:24px;border:1px solid ${c.blue};margin:24px 0}
code,pre{font-family:ThemeMono,monospace;font-synthesis:none}pre{white-space:pre-wrap}.accent{color:${c.accent}}.success{color:${c.green}}.error{color:${c['status.error']}}
img{width:100px;height:100px}button{background:${c.selection_background};color:${c.selection_foreground};border:0;padding:12px 24px;font:inherit}
ul{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));list-style:none;padding:0;gap:10px}li{display:flex;gap:10px;align-items:center}li span{width:28px;height:28px;flex-shrink:0;border:1px solid ${c.muted}}li b{margin-left:auto;font-size:12px}
</style><main><h1>Mega-City One</h1><p>Package foundation preview. Native desktop layouts and authentication are not yet implemented.</p>
<p id="font-status">Loading bundled fonts…</p><section><h2>Shared assets and terminal roles</h2><img src="../theme/assets/emblem.svg" alt="Classic eagle"><img src="../theme/assets/folder.svg" alt="Folder">
<pre><span class="accent">anElectricMonk@omarchy ~ ❯</span> git status
On branch main
<span class="success">Working tree clean</span>
<span class="error">Error: connection timed out</span>
I1l | O0 | rn m | 8B | 5S | 2Z
!= === &lt;= &gt;= -&gt; =&gt; :: / {} [] ()</pre><button>Selected state</button>
<p>Text family: ${escape(typography.roles.mono.family)}. Nimbus panel face remains an external dependency.</p></section>
<section><h2>All ${Object.keys(c).length} resolved colours</h2><ul>${swatches}</ul></section></main>
<script>Promise.all([document.fonts.load('16px ThemeMono'),document.fonts.load('16px ThemeInterface')]).then(results=>{if(results.some(r=>!r.length))throw Error('A bundled font failed to load');document.getElementById('font-status').textContent='Bundled fonts loaded';document.body.dataset.fontsReady='true';}).catch(e=>{document.getElementById('font-status').textContent=e.message;document.body.dataset.fontsReady='false';});</script></html>\n`;
}
