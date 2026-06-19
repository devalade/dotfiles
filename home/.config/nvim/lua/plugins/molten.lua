-- molten.nvim: run Jupyter kernels inside neovim.
-- Pairs well with jupytext for .ipynb files. See ~/.config/nvim/README or
-- :help molten for details.

return {
  -- Python provider for nvim. Pinned to a dedicated venv so system Python stays clean.
  -- Recreate with: python3 -m venv ~/.virtualenvs/neovim &&
  --   ~/.virtualenvs/neovim/bin/pip install pynvim jupyter_client ipykernel nbformat \
  --     pillow cairosvg pnglatex plotly kaleido pyperclip
  {
    "benlubas/molten-nvim",
    version = "^1.0.0",
    dependencies = { "3rd/image.nvim" },
    build = ":UpdateRemotePlugins",
    init = function()
      vim.g.python3_host_prog = vim.fn.expand("~/.virtualenvs/neovim/bin/python3")

      vim.g.molten_image_provider = "image.nvim"
      vim.g.molten_output_win_max_height = 20
      vim.g.molten_auto_open_output = false
      vim.g.molten_virt_text_output = true
      vim.g.molten_virt_lines_off_by_1 = true
      vim.g.molten_wrap_output = true
    end,
    keys = {
      { "<leader>mi", ":MoltenInit<CR>",                desc = "Molten init kernel" },
      { "<leader>me", ":MoltenEvaluateOperator<CR>",    desc = "Molten run operator" },
      { "<leader>ml", ":MoltenEvaluateLine<CR>",        desc = "Molten run line" },
      { "<leader>mc", ":MoltenReevaluateCell<CR>",      desc = "Molten re-run cell" },
      { "<leader>md", ":MoltenDelete<CR>",              desc = "Molten delete cell" },
      { "<leader>mh", ":MoltenHideOutput<CR>",          desc = "Molten hide output" },
      { "<leader>mo", ":noautocmd MoltenEnterOutput<CR>", desc = "Molten enter output" },
      { "<leader>mv", ":<C-u>MoltenEvaluateVisual<CR>gv", mode = "v", desc = "Molten run visual" },

      -- Cell navigation for jupytext-style files (`# %%` markers). Replaces the
      -- NotebookNavigator plugin with the only two features we actually want.
      { "]c", function() vim.fn.search([[^# %%]], "W") end,  desc = "Next cell" },
      { "[c", function() vim.fn.search([[^# %%]], "bW") end, desc = "Prev cell" },
      {
        "<leader>x",
        function()
          local start = vim.fn.search([[^# %%]], "bcnW")
          local stop  = vim.fn.search([[^# %%]], "nW")
          if start == 0 then start = 1 end
          if stop  == 0 then stop  = vim.fn.line("$") + 1 end
          vim.api.nvim_win_set_cursor(0, { start, 0 })
          vim.cmd("normal! V")
          vim.api.nvim_win_set_cursor(0, { stop - 1, 0 })
          vim.cmd("MoltenEvaluateVisual")
          vim.cmd("normal! \27")  -- ESC to leave visual mode
        end,
        desc = "Run cell",
      },
      {
        "<leader>X",
        function()
          local start = vim.fn.search([[^# %%]], "bcnW")
          local stop  = vim.fn.search([[^# %%]], "nW")
          if start == 0 then start = 1 end
          if stop  == 0 then stop  = vim.fn.line("$") + 1 end
          vim.api.nvim_win_set_cursor(0, { start, 0 })
          vim.cmd("normal! V")
          vim.api.nvim_win_set_cursor(0, { stop - 1, 0 })
          vim.cmd("MoltenEvaluateVisual")
          vim.cmd("normal! \27")
          vim.fn.search([[^# %%]], "W")
        end,
        desc = "Run cell + next",
      },
    },
  },

  -- Inline image rendering. Works in Ghostty (Kitty graphics protocol).
  -- Inline images work natively in Ghostty/herdr panes (Kitty graphics protocol).
  {
    "3rd/image.nvim",
    opts = {
      backend = "kitty",
      max_width = 100,
      max_height = 30,
      max_height_window_percentage = math.huge,
      max_width_window_percentage = math.huge,
      window_overlap_clear_enabled = true,
      window_overlap_clear_ft_ignore = { "cmp_menu", "cmp_docs", "" },
    },
  },

  -- jupytext: open .ipynb files as editable Python with `# %%` cell markers,
  -- round-trips to JSON on save. The `jupytext` binary lives in the dedicated
  -- venv, not on system PATH, so point the plugin at it explicitly.
  --
  -- `style = "py:percent"` is what makes the file appear as Python with
  -- `# %%` markers — required for the cell-nav keymaps above to find cells.
  -- (Switching to "markdown" makes the buffer render as .md with fenced code
  -- blocks instead, which is the wrong format for our setup.)
  {
    "goerz/jupytext.nvim",
    lazy = false,
    opts = {
      jupytext = vim.fn.expand("~/.virtualenvs/neovim/bin/jupytext"),
      style = "py:percent",
      output_extension = "auto",
      force_ft = nil,
    },
  },

}
