const rgb = hex => hex.slice(1).match(/../g).map(part => Number.parseInt(part, 16));

export function applicationTheme(model, typography) {
  const c = model.colors, font = typography.roles.interface.family, size = typography.sizes.interfacePx;
  const gtk = `/* Generated local application styling; retain native widget structure. */
@define-color theme_bg_color ${c['gtk.background']};
@define-color theme_fg_color ${c['gtk.text']};
@define-color theme_base_color ${c['gtk.background']};
@define-color theme_text_color ${c['gtk.text']};
@define-color theme_selected_bg_color ${c['gtk.selection']};
@define-color theme_selected_fg_color ${c['gtk.selectionText']};
@define-color insensitive_bg_color ${c['gtk.background']};
@define-color insensitive_base_color ${c['gtk.background']};
@define-color theme_unfocused_bg_color ${c['gtk.background']};
@define-color theme_unfocused_fg_color ${c['gtk.text']};
@define-color theme_unfocused_text_color ${c['gtk.text']};
@define-color theme_unfocused_selected_bg_color ${c['gtk.selection']};
@define-color theme_unfocused_selected_fg_color ${c['gtk.selectionText']};
@define-color insensitive_fg_color ${c['ui.disabled']};
@define-color borders ${c.blue};
@define-color window_bg_color ${c['gtk.background']};
@define-color window_fg_color ${c['gtk.text']};
@define-color view_bg_color ${c['gtk.background']};
@define-color view_fg_color ${c['gtk.text']};
@define-color accent_bg_color ${c['gtk.selection']};
@define-color accent_fg_color ${c['gtk.selectionText']};
@define-color accent_color ${c.accent};
* { font-family: "${font}"; font-size: ${size}px; }
window, dialog, .background { background-color: ${c['gtk.background']}; color: ${c['gtk.text']}; }
headerbar, toolbar, .toolbar { background-color: ${c.background}; color: ${c['gtk.text']}; background-image: none; box-shadow: none; }
list, listview, gridview, textview, textview text, .view, .sidebar, .navigation-sidebar { background-color: ${c['gtk.background']}; color: ${c['gtk.text']}; }
button, entry, spinbutton, combobox { background-color: ${c.lighter_background}; color: ${c['gtk.text']}; background-image: none; border: 1px solid ${c.blue}; box-shadow: none; text-shadow: none; }
headerbar button, button.flat { background-color: transparent; border-color: transparent; box-shadow: none; }
headerbar button:hover { background-color: ${c['ui.hover']}; }
button:hover, row:hover { background-color: ${c['ui.hover']}; }
button:active { background-color: ${c['ui.pressed']}; }
button:disabled, entry:disabled, label:disabled { color: ${c['ui.disabled']}; }
button:focus, entry:focus, spinbutton:focus { outline: 2px solid ${c.accent}; outline-offset: 1px; border-color: ${c.accent}; }
selection, row:selected, gridview > child:selected, listview > row:selected, iconview:selected, .view:selected, .sidebar row:selected, .navigation-sidebar row:selected { background-color: ${c['gtk.selection']}; color: ${c['gtk.selectionText']}; }
entry.error, textview.error { border-color: ${c['status.error']}; }
check, radio { background-color: ${c.darker_background}; border: 1px solid ${c.blue}; }
check:checked, radio:checked { background-image: none; -gtk-icon-source: -gtk-icontheme("object-select-symbolic"); }
check:checked, radio:checked, button:checked { background-color: ${c['gtk.selection']}; color: ${c['gtk.selectionText']}; }
notebook header, popover, menu, tooltip { background-color: ${c.background}; color: ${c['gtk.text']}; }
notebook tab:checked { border-bottom: 2px solid ${c.accent}; }
progressbar progress, scale highlight { background-image: none; background-color: ${c.accent}; border-color: ${c.accent}; }
`;
  const gtk4 = gtk.replaceAll('entry:focus', 'entry:focus-within').replaceAll('spinbutton:focus', 'spinbutton:focus-within') + `
:root {
  --accent-bg-color: ${c.accent}; --accent-fg-color: ${c.background}; --accent-color: ${c.accent};
  --window-bg-color: ${c['gtk.background']}; --window-fg-color: ${c['gtk.text']};
  --view-bg-color: ${c['gtk.background']}; --view-fg-color: ${c['gtk.text']};
  --headerbar-bg-color: ${c.background}; --headerbar-fg-color: ${c.foreground};
  --sidebar-bg-color: ${c.background}; --sidebar-fg-color: ${c.foreground}; --sidebar-backdrop-color: ${c.background};
  --popover-bg-color: ${c.background}; --popover-fg-color: ${c.foreground};
  --dialog-bg-color: ${c.background}; --dialog-fg-color: ${c.foreground};
  --card-bg-color: ${c.lighter_background}; --card-fg-color: ${c.foreground};
  --border-color: ${c.blue};
}
`;
  const qt = `QWidget { background-color: ${c['qt.background']}; color: ${c['qt.text']}; font-family: "${font}"; font-size: ${size}px; }
QMainWindow, QDialog, QAbstractScrollArea { background-color: ${c['qt.background']}; }
QPushButton, QLineEdit, QComboBox, QSpinBox { background-color: ${c.lighter_background}; border: 1px solid ${c.blue}; padding: 5px; }
QPushButton:hover { background-color: ${c['ui.hover']}; }
QPushButton:pressed { background-color: ${c['ui.pressed']}; }
QPushButton:default, QLineEdit:focus, QComboBox:focus { border: 2px solid ${c.accent}; }
QWidget:disabled { color: ${c['ui.disabled']}; }
QAbstractItemView { selection-background-color: ${c['qt.selection']}; selection-color: ${c['qt.selectionText']}; }
QLineEdit { selection-background-color: ${c['qt.selection']}; selection-color: ${c['qt.selectionText']}; }
QTabBar::tab { background-color: ${c.background}; padding: 7px; }
QTabBar::tab:selected { background-color: ${c.lighter_background}; border-bottom: 2px solid ${c.accent}; }
QCheckBox::indicator, QRadioButton::indicator { border: 1px solid ${c.blue}; background-color: ${c.darker_background}; }
QCheckBox::indicator:checked, QRadioButton::indicator:checked { background-color: ${c['qt.selection']}; }
QProgressBar::chunk { background-color: ${c.accent}; }
`;
  const style = (fg, bg) => `{ fg = "${fg}", bg = "${bg}" }`;
  const yazi = `[mgr]
cwd = { fg = "${c.accent}" }
find_keyword = { fg = "${c.background}", bg = "${c.accent}" }
find_position = { fg = "${c.accent}" }
marker_copied = { fg = "${c.green}" }
marker_cut = { fg = "${c['status.error']}" }
marker_marked = { fg = "${c.accent}" }
marker_selected = { fg = "${c.accent}" }
border_style = { fg = "${c.blue}" }

[indicator]
parent = ${style(c.selection_foreground, c.selection_background)}
current = ${style(c.selection_foreground, c.selection_background)}
preview = ${style(c.selection_foreground, c.selection_background)}

[tabs]
active = ${style(c.selection_foreground, c.selection_background)}
inactive = ${style(c.muted, c.background)}

[mode]
normal_main = ${style(c.background, c.accent)}
normal_alt = ${style(c.foreground, c.lighter_background)}
select_main = ${style(c.background, c.green)}
select_alt = ${style(c.foreground, c.lighter_background)}
unset_main = ${style(c.background, c.red)}
unset_alt = ${style(c.foreground, c.lighter_background)}

[status]
overall = ${style(c.foreground, c.background)}
perm_type = { fg = "${c.blue}" }
perm_read = { fg = "${c.green}" }
perm_write = { fg = "${c.accent}" }
perm_exec = { fg = "${c['status.error']}" }

[filetype]
rules = [
  { url = "*/", fg = "${c['art.folder']}" },
  { mime = "image/*", fg = "${c.magenta}" },
  { mime = "video/*", fg = "${c.cyan}" },
  { mime = "application/*zip*", fg = "${c.orange}" },
]
`;
  const browser = { manifest_version: 3, name: 'Mega-City One', version: '0.1.0',
    description: 'Shared navy, cream and gold browser chrome. No page styling or permissions.',
    theme: { colors: {
      frame: rgb(c.background), frame_inactive: rgb(c.dark_background),
      toolbar: rgb(c['browser.toolbar']), tab_text: rgb(c.foreground),
      tab_background_text: rgb(c.foreground), bookmark_text: rgb(c.foreground),
      ntp_background: rgb(c.background), ntp_text: rgb(c.foreground),
      omnibox_background: rgb(c['browser.address']), omnibox_text: rgb(c.foreground),
    } } };
  return { 'gtk-3.0.css': gtk, 'gtk-4.0.css': gtk4, 'qt.qss': qt, 'yazi-theme.toml': yazi,
    'chromium.theme': rgb(c['browser.toolbar']).join(',') + '\n',
    'chromium-extension/manifest.json': JSON.stringify(browser, null, 2) + '\n' };
}
