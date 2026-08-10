# .pi

Global pi config, synced via dotfiles and stowed into `~/.pi`.

## Extension dependency workspace

Package-style global extensions stay in `agent/extensions/` so pi can still auto-discover them from:

- `~/.pi/agent/extensions/*.ts`
- `~/.pi/agent/extensions/*/index.ts`

This directory is now the shared npm workspace root for extensions with their own `package.json` files.

Install or refresh all extension dependencies from here:

```bash
npm install
```

Run workspace checks:

```bash
npm run check
```

Current workspace-managed extensions live under:

- `agent/extensions/web-tools`
- `agent/extensions/pi-mcp`
- `agent/extensions/opencode-cloudflare`

The standalone `agent/extensions/deepseek-execution.ts` extension applies the
highest available thinking level to `opencode-go/deepseek-v4-flash`, adds
execution-focused guidance, and provides a bounded `batch_read` tool.

After changing extension code, reload pi with `/reload`.
