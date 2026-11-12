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
│   ├── herdr/          # Terminal multiplexer (replaced tmux)
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
├── home/.t3/           # T3 Code config (settings, keybindings; no state/secrets)
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
| Herdr keybinds | `home/.config/herdr/config.toml` |
| Starship prompt | `home/.config/starship.toml` |
| Pi extension | `home/.pi/agent/extensions/<name>/` |
| Pi skill | `home/.agents/skills/<name>/SKILL.md` |
| Global skill | `home/.agents/skills/<name>/SKILL.md` |
| Sync skills to all agents | `dot skills sync` |
| Pi settings | `home/.pi/agent/settings.json` |
| Grok worker rule | `home/.grok/rules/pi-worker.md` |
| Work git identity | Auto via `home/.config/git/work_config` for `~/Code/work/` |
| Resolve captions | `home/.config/davinci-captions/` (Handy + MediaBunny, no ffmpeg) |
| T3 Code settings | `home/.t3/userdata/settings.json` (providers, favorites) |
| T3 Code keybindings | `home/.t3/userdata/keybindings.json` |
| T3 Code UI prefs | `home/.t3/userdata/client-settings.json` |

## CONVENTIONS

- Stow layout: `home/` mirrors `~`, stow creates symlinks
- Neovim: 1 plugin per file in `lua/plugins/`, returns lazy.nvim spec
- Private helpers: prefix `__` (e.g., `__git.default_branch`)
- Agent skills: canonical pool at `home/.agents/skills/`, rsynced to `~/.agents/skills` and symlinked into each agent's dir; stow skips them via `home/.stow-local-ignore`
- Two deployers, never one tree: stow owns everything except `.agents/skills` and `.agents/pstack-opencode`, which `dot skills sync` and pstack's installer own
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
dot package add X     # Add + install package
dot skills sync       # Symlink ~/.agents/skills into ~/.codex/skills
dot gen-ssh-key       # Generate ed25519 key by email domain
tidy                  # Dry-run Downloads/Documents organizer (tidy --apply to move)
/tidy                 # OpenCode command: dry-run plan, then apply via agent
dot tidy install      # Daily 09:00 cleanup: launchd → API prompt to dedicated session
dot captions install  # Local captions for Resolve free: deps + script link + Handy check
```

## KEY CONFIGS

| Tool | Entry | Notes |
|------|-------|-------|
| Neovim | `init.lua` | LazyVim: `require("config.lazy")` |
| Herdr | `herdr/config.toml` | Prefix `ctrl+a`, vim pane nav, theme auto-switch |
| Git | `config` | SSH signing, `pull.rebase`, conditional include |
| Starship | `starship.toml` | 2s timeout (Vite+ shims), custom.scm after dir |
| Tidy | `tidy/rules.sh` | Downloads/Documents organizer (keyword + ext buckets) |
| Tidy skill | `home/.agents/skills/tidy-organize/` | Context: user, structure, safety rules |
| Daily cleanup | `dot tidy install` | LaunchAgent → API prompt to dedicated session, 09:00 |
| Pi | `settings.json` | Default provider: opencode.cloudflare.dev, Catppuccin theme |

## UNIQUE STYLES

- herdr prefix: `ctrl+a`
- herdr splits: `prefix+v` vertical, `prefix+minus` horizontal
- herdr pane nav: `prefix+h/j/k/l` (no prefix-free nav, so nvim keeps plain h/l)
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
