const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

export function desktopTheme(model, typography, effects) {
  const c = model.colors;
  const rgba = color => `rgba(${color.slice(1).toLowerCase()}ff)`;
  const hyprland = `-- Generated theme settings; stock services and client decorations remain owners.
local activeBorder = { colors = { "${rgba(c.hyprland_active_border)}", "${rgba(c.bright_yellow)}", "${rgba(c.brown)}" } }
hl.config({
  general = { border_size = 2, col = { active_border = activeBorder, inactive_border = "${rgba(c.hyprland_inactive_border)}" } },
  decoration = { rounding = 0, active_opacity = 1, inactive_opacity = 1, blur = { enabled = true, size = ${effects.backdropBlurPx}, passes = 1 } },
  group = { col = { border_active = activeBorder, border_inactive = "${rgba(c.hyprland_inactive_border)}" } },
})
hl.curve("drokkBorder", { type = "bezier", points = { { 0.35, 0 }, { 0.65, 1 } } })
hl.animation({ leaf = "borderangle", enabled = true, speed = ${effects.borderPulseSpeed}, bezier = "drokkBorder", style = "once" })
-- Cancel stock whole-window fading. Translucency belongs to app/surface backgrounds.
hl.window_rule({ match = { tag = "default-opacity" }, opacity = "1 1" })
-- Blur the translucent shell cards, excluding transparent space and the menu scrim.
hl.layer_rule({ match = { namespace = "^(omarchy-menu|omarchy-notifications|omarchy-keyboard-panel|megacity-launcher)$" }, blur = true, ignore_alpha = 0.2 })
`;
  const btop = {
    main_bg: c.background, main_fg: c.foreground, title: c.foreground,
    hi_fg: c.accent, selected_bg: c.selection_background, selected_fg: c.selection_foreground,
    inactive_fg: c.muted, graph_text: c.light_foreground, meter_bg: c.lighter_background,
    proc_misc: c.light_foreground, cpu_box: c.blue, mem_box: c.blue, net_box: c.blue,
    proc_box: c.accent, div_line: c.muted,
  };
  for (const graph of ['temp', 'cpu', 'free', 'cached', 'available', 'used', 'download', 'upload', 'process']) {
    btop[graph + '_start'] = c['monitor.graph'];
    btop[graph + '_mid'] = c['monitor.current'];
    btop[graph + '_end'] = c['monitor.threshold'];
  }
  const gradient = ['background', 'dark_background', 'lighter_background', 'blue', 'muted', 'foreground', 'light_foreground', 'bright_foreground'];
  gradient.forEach((role, i) => { btop['gradient_color_' + i] = c[role]; });
  const baseColors = { bg: c.background, dark_bg: c.dark_background, darker_bg: c.darker_background,
    lighter_bg: c.lighter_background, fg: c.foreground, dark_fg: c.dark_foreground,
    light_fg: c.light_foreground, bright_fg: c.bright_foreground, cursor: c['terminal.cursor'],
    ...Object.fromEntries(Object.entries(c).filter(([id]) => !id.includes('.'))) };
  const highlights = {
    Keyword: c['editor.keyword'], '@keyword': c['editor.keyword'], String: c['editor.string'],
    '@string': c['editor.string'], Comment: c['editor.comment'], '@comment': c['editor.comment'],
    Number: c['editor.number'], '@number': c['editor.number'], DiagnosticError: c['status.error'],
    DiagnosticWarn: c['status.warning'], DiagnosticInfo: c['status.info'], DiagnosticHint: c.muted,
  };
  const luaColors = Object.entries(baseColors).map(([key,value]) => `        ${key} = "${value}",`).join('\n');
  const luaHighlights = Object.entries(highlights).map(([key,value]) => `          ["${key}"] = "${value}",`).join('\n');
  const neovim = `return {
  {
    "bjarneo/aether.nvim", branch = "v3", name = "aether", priority = 1000,
    opts = {
      colors = {
${luaColors}
      },
      styles = { comments = { italic = false }, keywords = { italic = false } },
      on_highlights = function(groups)
        for _, group in pairs(groups) do
          if type(group) == "table" then group.bold = false; group.italic = false end
        end
        local syntax = {
${luaHighlights}
        }
        for name, color in pairs(syntax) do groups[name] = { fg = color, bold = false, italic = false } end
        groups.Visual = { bg = "${c.selection_background}", fg = "${c.selection_foreground}" }
      end,
    },
  },
  { "LazyVim/LazyVim", opts = { colorscheme = "aether" } },
}
`;
  const fonts = `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
  <dir prefix="relative">fonts</dir>
  <cachedir prefix="xdg">fontconfig</cachedir>
  <alias binding="strong"><family>monospace</family><prefer><family>${xml(typography.roles.mono.family)}</family></prefer></alias>
</fontconfig>
`;
  return { 'hyprland.lua': hyprland, 'btop.theme': Object.entries(btop).map(([key,value]) => `theme[${key}]="${value}"`).join('\n') + '\n', 'neovim.lua': neovim, 'fonts.conf': fonts };
}
