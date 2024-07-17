return {
  { -- lazy
    "ccaglak/phptools.nvim",
    keys = {
      { "<leader>lm", "<cmd>PhpMethod<cr>" },
      { "<leader>lc", "<cmd>PhpClass<cr>" },
      { "<leader>ls", "<cmd>PhpScripts<cr>" },
      { "<leader>ln", "<cmd>PhpNamespace<cr>" },
      { "<leader>lg", "<cmd>PhpGetSet<cr>" },
      { "<leader>lf", "<cmd>PhpCreate<cr>" },
    },
    dependencies = {
      "nvim-lua/plenary.nvim",
    },
    config = function()
      require("phptools").setup {
        ui = false, -- if you have stevearc/dressing.nvim or something similar keep it false or else true
      }
      vim.keymap.set("v", "<leader>lr", ":PhpRefactor<cr>")
    end,
  },
  {
    "adalessa/laravel.nvim",
    dependencies = {
      "nvim-telescope/telescope.nvim",
      "tpope/vim-dotenv",
      "MunifTanjim/nui.nvim",
      "nvimtools/none-ls.nvim",
    },
    cmd = { "Sail", "Artisan", "Composer", "Npm", "Yarn", "Laravel" },
    keys = {
      { "<leader>la", ":Laravel artisan<cr>" },
      { "<leader>lr", ":Laravel routes<cr>" },
      { "<leader>lm", ":Laravel related<cr>" },
    },
    event = { "VeryLazy" },
    config = true,
  },
  {
    "ccaglak/larago.nvim",
    dependencies = {
      "nvim-lua/plenary.nvim",
    },
  },

  -- lazy
  "ccaglak/namespace.nvim",
  keys = {
    { "<leader>la", "<cmd>GetClasses<cr>" },
    { "<leader>lc", "<cmd>GetClass<cr>" },
    { "<leader>ls", "<cmd>ClassAs<cr>" },
    { "<leader>ln", "<cmd>Namespace<cr>" },
  },
  dependencies = {
    "nvim-lua/plenary.nvim",
  },
}
