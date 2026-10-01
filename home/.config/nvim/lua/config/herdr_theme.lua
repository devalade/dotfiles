-- Resolve the nvim colorscheme from herdr's [theme] config so both stay in sync.
local M = {}

local CONFIG = vim.fn.expand("~/.config/herdr/config.toml")

-- Every theme herdr ships -> { colorscheme, background, optional catppuccin flavour }
local MAP = {
  ["catppuccin"] = { "catppuccin", "dark", "macchiato" },
  ["catppuccin-latte"] = { "catppuccin", "light", "latte" },
  ["tokyo-night"] = { "tokyonight-night", "dark" },
  ["tokyo-night-day"] = { "tokyonight-day", "light" },
  ["dracula"] = { "dracula", "dark" },
  ["nord"] = { "nord", "dark" },
  ["gruvbox"] = { "gruvbox", "dark" },
  ["gruvbox-light"] = { "gruvbox", "light" },
  ["one-dark"] = { "onedark", "dark" },
  ["one-light"] = { "onelight", "light" },
  ["solarized"] = { "solarized", "dark" },
  ["solarized-light"] = { "solarized", "light" },
  ["kanagawa"] = { "kanagawa-wave", "dark" },
  ["kanagawa-lotus"] = { "kanagawa-lotus", "light" },
  ["rose-pine"] = { "rose-pine-main", "dark" },
  ["rose-pine-dawn"] = { "rose-pine-dawn", "light" },
  ["vesper"] = { "vesper", "dark" },
  -- herdr "terminal": inherit the host terminal's palette
  ["terminal"] = { "default" },
}

local function system_is_dark()
  return vim.fn.system({ "defaults", "read", "-g", "AppleInterfaceStyle" }):match("Dark") ~= nil
end

--- Parse the [theme] table of herdr's config.toml.
local function read_theme()
  local ok, lines = pcall(vim.fn.readfile, CONFIG)
  if not ok then
    return {}
  end
  local theme, in_theme = {}, false
  for _, line in ipairs(lines) do
    local section = line:match("^%s*%[([%w_.]+)%]")
    if section then
      in_theme = section == "theme"
    elseif in_theme then
      local k, v = line:match("^%s*([%w_]+)%s*=%s*(.-)%s*$")
      if k then
        theme[k] = v:match('^"([^"]*)"') or v:match("^[^%s#]+")
      end
    end
  end
  return theme
end

--- Name of the herdr theme currently in effect.
function M.name()
  local t = read_theme()
  if t.auto_switch == "true" then
    return system_is_dark() and (t.dark_name or t.name) or (t.light_name or t.name)
  end
  return t.name or "catppuccin"
end

--- { colorscheme, background, flavour } for the current herdr theme.
function M.resolve()
  local name = M.name()
  local m = MAP[name] or { name }
  m = { m[1], m[2] or (system_is_dark() and "dark" or "light"), m[3] }
  return { scheme = m[1], background = m[2], flavour = m[3], name = name }
end

function M.apply()
  local r = M.resolve()
  if r.name == M._applied then
    return
  end
  vim.o.background = r.background
  if r.flavour then
    vim.g.catppuccin_flavour = r.flavour
    pcall(function()
      require("catppuccin").options.flavour = r.flavour
    end)
  end
  if pcall(vim.cmd.colorscheme, r.scheme) then
    M._applied = r.name
  end
end

function M.setup()
  M._applied = M.resolve().name
  vim.api.nvim_create_autocmd({ "FocusGained", "VimResume", "CursorHold" }, {
    group = vim.api.nvim_create_augroup("herdr_theme_sync", { clear = true }),
    callback = M.apply,
  })
  -- Poll so a theme change in herdr settings applies without refocusing.
  local timer = vim.uv.new_timer()
  timer:start(2000, 2000, vim.schedule_wrap(M.apply))
end

return M
