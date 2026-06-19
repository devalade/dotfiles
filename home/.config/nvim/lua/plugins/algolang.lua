return {
	{
		"neovim/nvim-lspconfig",
		init = function()
			vim.lsp.config("algolang", {
				cmd = { vim.fn.exepath("algolang-lsp"), "--stdio" },
				filetypes = { "algo" },
				root_markers = { ".git", "*.algo" },
				single_file_support = true,
			})
			vim.lsp.enable("algolang")
		end,
	},
	{
		"saghen/blink.cmp",
		optional = true,
		opts = function(_, opts)
			opts.sources = opts.sources or {}
			opts.sources.per_filetype = opts.sources.per_filetype or {}
			opts.sources.per_filetype.algo = { "lsp" }
		end,
	},
}
