return {
  'tpope/vim-commentary',
  config = function()
    -- Maintain cursor position
    vim.keymap.set('n', '<Leader>/', 'my<cmd>norm v<bar>gc<cr>`y')
    vim.keymap.set('n', '<Leader>/ip', 'my<cmd>norm vip<bar>gc<cr>`y')
    vim.keymap.set('n', '<Leader>/ia', 'my<cmd>norm via<bar>gc<cr>`y')
  end,
}
