-- Colorscheme follows the theme selected in herdr (~/.config/herdr/config.toml),
-- re-checked live while nvim is running. See lua/config/herdr_theme.lua.
-- One plugin per theme family herdr ships.
local herdr = require("config.herdr_theme")
local r = herdr.resolve()

vim.o.background = r.background
if r.flavour then
  vim.g.catppuccin_flavour = r.flavour
end

return {
  { "catppuccin/nvim", name = "catppuccin", opts = { flavour = r.flavour or "macchiato" } },
  { "folke/tokyonight.nvim", opts = { style = "day" } },
  { "Mofiqul/dracula.nvim" },
  { "gbprod/nord.nvim" },
  { "ellisonleao/gruvbox.nvim" },
  { "olimorris/onedarkpro.nvim" },
  { "maxmx03/solarized.nvim" },
  { "rebelot/kanagawa.nvim" },
  { "rose-pine/neovim", name = "rose-pine" },
  { "datsfilipe/vesper.nvim" },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = function()
        herdr.setup()
        pcall(vim.cmd.colorscheme, r.scheme)
      end,
    },
  },
}
