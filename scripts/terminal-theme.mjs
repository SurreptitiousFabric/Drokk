const ansiRoles = ['background', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'foreground', 'muted', 'bright_red', 'bright_green', 'bright_yellow', 'bright_blue', 'bright_magenta', 'bright_cyan', 'bright_foreground'];
const ansiNames = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

export function terminalTheme(model, typography) {
  const c = model.colors, alpha = model.alpha['effects.terminal-background-alpha'];
  const family = typography.roles.mono.family, pixels = typography.sizes.terminalPx;
  const points = pixels * 72 / 96;
  const font = `${family}:pixelsize=${pixels}`;
  const ansi = ansiRoles.map(role => c[role]);
  const strip = color => color.slice(1);
  const foot = `[main]\nfont=${font}\nfont-bold=${font}\nfont-italic=${font}\nfont-bold-italic=${font}\n\n[colors-dark]\nbackground=${strip(c.background)}\nforeground=${strip(c.foreground)}\nselection-background=${strip(c.selection_background)}\nselection-foreground=${strip(c.selection_foreground)}\ncursor=${strip(c.background)} ${strip(c['terminal.cursor'])}\nalpha=${alpha}\nalpha-mode=default\n` +
    ansi.map((color, i) => `${i < 8 ? 'regular' : 'bright'}${i % 8}=${strip(color)}`).join('\n') + '\n';
  const ghostty = `background = ${c.background}\nforeground = ${c.foreground}\ncursor-color = ${c['terminal.cursor']}\nselection-background = ${c.selection_background}\nselection-foreground = ${c.selection_foreground}\nbackground-opacity = ${alpha}\nfont-family = "${family}"\nfont-style = Regular\nfont-style-bold = Regular\nfont-style-italic = Regular\nfont-style-bold-italic = Regular\nfont-size = ${points}\n` + ansi.map((color, i) => `palette = ${i}=${color}`).join('\n') + '\n';
  const kitty = `background ${c.background}\nforeground ${c.foreground}\ncursor ${c['terminal.cursor']}\ncursor_text_color ${c.background}\nselection_background ${c.selection_background}\nselection_foreground ${c.selection_foreground}\nbackground_opacity ${alpha}\nfont_family ${family}\nbold_font ${family}\nitalic_font ${family}\nbold_italic_font ${family}\nfont_size ${points}\n` + ansi.map((color, i) => `color${i} ${color}`).join('\n') + '\n';
  const fontStyle = `{ family = "${family}", style = "Regular" }`;
  const alacritty = `[window]\nopacity = ${alpha}\n\n[font]\nsize = ${points}\nnormal = ${fontStyle}\nbold = ${fontStyle}\nitalic = ${fontStyle}\nbold_italic = ${fontStyle}\n\n[colors.primary]\nbackground = "${c.background}"\nforeground = "${c.foreground}"\n\n[colors.cursor]\ntext = "${c.background}"\ncursor = "${c['terminal.cursor']}"\n\n[colors.selection]\ntext = "${c.selection_foreground}"\nbackground = "${c.selection_background}"\n\n` +
    ['normal', 'bright'].map((group, row) => `[colors.${group}]\n` + ansiNames.map((name, i) => `${name} = "${ansi[row * 8 + i]}"`).join('\n')).join('\n\n') + '\n';
  return { 'foot.ini': foot, 'ghostty.conf': ghostty, 'kitty.conf': kitty, 'alacritty.toml': alacritty };
}
