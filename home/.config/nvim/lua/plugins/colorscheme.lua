-- Colorscheme follows macOS appearance (matches Ghostty + herdr):
-- dark  -> catppuccin (Macchiato)
-- light -> tokyonight day
local dark = vim.fn.system({ "defaults", "read", "-g", "AppleInterfaceStyle" }):match("Dark") ~= nil
vim.o.background = dark and "dark" or "light"
if dark then
  vim.g.catppuccin_flavour = "macchiato"
end

return {
  {
    "folke/tokyonight.nvim",
    opts = {
      style = "day",
    },
  },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = dark and "catppuccin" or "tokyonight-day",
    },
  },
}