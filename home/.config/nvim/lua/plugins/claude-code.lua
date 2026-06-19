local float_win = {
  style = "float",
  width = 0.85,
  height = 0.85,
  border = "rounded",
  title_pos = "center",
}

return {
  {
    "folke/snacks.nvim",
    keys = {
      {
        "<leader>tc",
        function()
          Snacks.terminal.toggle("claude --dangerously-skip-permissions", {
            win = vim.tbl_extend("force", float_win, { title = " Claude Code " }),
          })
        end,
        desc = "Toggle Claude Code",
      },
      {
        "<leader>to",
        function()
          Snacks.terminal.toggle("opencode --dangerously-skip-permissions", {
            win = vim.tbl_extend("force", float_win, { title = " OpenCode " }),
          })
        end,
        desc = "Toggle OpenCode",
      },
      {
        "<leader>tx",
        function()
          Snacks.terminal.toggle("codex --dangerously-bypass-approvals-and-sandbox", {
            win = vim.tbl_extend("force", float_win, { title = " Codex " }),
          })
        end,
        desc = "Toggle Codex",
      },
      {
        "<leader>tu",
        function()
          Snacks.terminal.toggle("cursor-agent --yolo --sandbox disabled", {
            win = vim.tbl_extend("force", float_win, { title = " Cursor Agent " }),
          })
        end,
        desc = "Toggle Cursor Agent",
      },
    },
  },
}
