-- Autocmds are automatically loaded on the VeryLazy event
-- Default autocmds that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/autocmds.lua
--
-- Add any additional autocmds here
-- with `vim.api.nvim_create_autocmd`
--
-- Or remove existing autocmds by their group name (which is prefixed with `lazyvim_` for the defaults)
-- e.g. vim.api.nvim_del_augroup_by_name("lazyvim_wrap_spell")

-- Keep the colorscheme in sync with macOS light/dark appearance changes.
local function system_is_dark()
  local out = vim.fn.system({ "defaults", "read", "-g", "AppleInterfaceStyle" })
  return vim.v.shell_error == 0 and vim.trim(out) == "Dark"
end

local function apply_appearance()
  local dark = system_is_dark()
  local want = dark and "catppuccin" or "tokyonight-day"
  if (vim.g.colors_name or "") ~= want then
    vim.o.background = dark and "dark" or "light"
    if dark then
      vim.g.catppuccin_flavour = "macchiato"
    end
    pcall(vim.cmd.colorscheme, want)
  end
end

-- Apply as soon as the editor renders (startup pick already happens in
-- plugins/colorscheme.lua; this guards against any flash of the wrong theme).
vim.api.nvim_create_autocmd("UIEnter", { once = true, callback = apply_appearance })

-- macOS appearance can change while nvim is running (System Settings toggle,
-- scheduled appearance); poll cheaply and switch live.
local timer = (vim.uv or vim.loop).new_timer()
timer:start(5000, 5000, vim.schedule_wrap(apply_appearance))
