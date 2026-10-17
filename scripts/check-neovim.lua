local package_root = assert(arg[1], "package directory required")
local aether_path = assert(vim.env.THEMEME_AETHER_PATH, "installed Aether path required")
vim.opt.runtimepath:prepend(aether_path)
local specification = assert(loadfile(package_root .. "/theme/neovim.lua"))()
local options = specification[1].opts
options.plugins = { all = false, auto = false }
require("aether").load(options)
local records = {}
for _, name in ipairs({ "Normal", "Keyword", "String", "Comment", "Number", "DiagnosticError", "Visual" }) do
  records[name] = vim.api.nvim_get_hl(0, { name = name, link = false })
end
print(vim.json.encode(records))
