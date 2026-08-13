# DOTFILES

**Generated:** 2026-05-09T00:00:00Z
**Commit:** 871ce6f

macOS dev env via GNU Stow. Neovim + Tmux + Git + pi. (Shell: zsh, user-managed)

## STRUCTURE

```
.dotfiles/
├── dot                 # CLI: init/update/doctor/stow/package (2500 lines bash)
├── home/.config/       # Stowed to ~/.config/
│   ├── nvim/           # Editor (AGENTS.md)
│   ├── tmux/           # Multiplexer + TPM plugins
│   ├── git/            # Conditional work config
│   ├── ghostty/        # Terminal
│   ├── starship.toml   # Prompt (custom.scm, 2s timeout for Vite+)
│   └── ripgrep/        # rg config
├── home/.agents/       # Global agent skills (cross-agent)
│   ├── skills/         # 67 agent skills (SKILL.md + resources)
│   └── sync-skills.sh  # Copies pool to ~/.agents/skills and wires agents
├── home/.pi/           # Pi agent workspace (AGENTS.md)
│   ├── agent/extensions/ # 6 TypeScript extensions
│   └── agent/skills/   # Populated by `dot skills sync` -> ~/.agents/skills
├── packages/
│   ├── bundle          # Base Brewfile (32 formulas, 13 casks)
│   └── bundle.work     # Work additions (formulas only)
└── docs/
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add package | `dot package add <name>` or edit `packages/bundle` |
| Git alias | `home/.config/git/config` [alias] section |
| Neovim plugin | `home/.config/nvim/lua/plugins/<name>.lua` |
| Neovim keymap | `home/.config/nvim/lua/config/keymaps.lua` |
| Tmux binding | `home/.config/tmux/tmux.conf` |
| Starship prompt | `home/.config/starship.toml` |
| Pi extension | `home/.pi/agent/extensions/<name>/` |
| Pi skill | `home/.agents/skills/<name>/SKILL.md` |
| Global skill | `home/.agents/skills/<name>/SKILL.md` |
| Sync skills to all agents | `dot skills sync` |
| Pi settings | `home/.pi/agent/settings.json` |
| Work git identity | Auto via `home/.config/git/work_config` for `~/Code/work/` |

## CONVENTIONS

- Stow layout: `home/` mirrors `~`, stow creates symlinks
- Neovim: 1 plugin per file in `lua/plugins/`, returns lazy.nvim spec
- Private helpers: prefix `__` (e.g., `__git.default_branch`)
- Agent skills: canonical pool at `home/.agents/skills/`, symlinked into each agent's dir
- Pi extensions: TypeScript, npm workspaces under `home/.pi/`
- Pi skills: Markdown-first (`SKILL.md`) with optional bundled resources

## ANTI-PATTERNS

- Edit `~/.config/*` directly (changes lost on stow)
- Casks in `bundle.work` (use base bundle)
- Hardcode paths (use `$DOTFILES_DIR`, `$HOME`)
- Nested git repos in stowed dirs (creates symlink issues)
- node_modules in stowed dirs (pi extensions exception — gitignored)

## COMMANDS

```bash
dot init              # Full setup (brew, stow, bun, ssh, font)
dot update            # Pull + brew upgrade + restow + pi update + Pocock skills sync
dot doctor            # Health check
dot stow              # Resymlink only
dot kill-port 3000    # Kill process listening on a port
dot package add X     # Add + install package
dot skills sync       # Symlink ~/.agents/skills into ~/.codex/skills
dot gen-ssh-key       # Generate ed25519 key by email domain
```

## KEY CONFIGS

| Tool | Entry | Notes |
|------|-------|-------|
| Neovim | `init.lua` | LazyVim: `require("config.lazy")` |
| Tmux | `tmux.conf` | Prefix `C-;`, auto-installs TPM |
| Git | `config` | SSH signing, `pull.rebase`, conditional include |
| Starship | `starship.toml` | 2s timeout (Vite+ shims), custom.scm after dir |
| Pi | `settings.json` | Default provider: opencode.cloudflare.dev, Catppuccin theme |

## UNIQUE STYLES

- tmux prefix: `C-;` (not `C-b`)
- tmux splits: `\` horizontal, `Enter` vertical
- tmux extended-keys: `always` + CSI-u (required for pi/claude-code)
- nvim: `jj`/`JJ` exit insert, `H`/`L` line start/end
- nvim completion: blink.cmp (not nvim-cmp), LSP source score_offset=1000
- git: `fomo` = fetch origin main + rebase
- Theme: Catppuccin Macchiato across all tools

## NOTES

- `dot update` handles WARP VPN brew API issues automatically
- Tmux theme must load BEFORE continuum (status-right conflict)
- Starship `command_timeout = 2000` because Vite+ node shims are slow
- `.pi/agent/*` mostly gitignored; extensions + skills explicitly un-ignored
- jj was removed; repo now uses git only
