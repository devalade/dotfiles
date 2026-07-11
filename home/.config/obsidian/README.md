# Obsidian vault (git)

Default path: `~/Works/personal/obsidian`  
Remote: private `devalade/obsidian`  
Hourly sync via LaunchAgent `com.devalade.obsidian-vault-sync`.

## One-shot setup

```bash
dot obsidian install
```

Links `obsidian-vault-sync` + LaunchAgent from your dotfiles repo (does not require a clean full `dot stow`).

## Commands

| Command | Effect |
|---|---|
| `dot obsidian install` | Stow links + load hourly LaunchAgent + run once |
| `dot obsidian uninstall` | Unload LaunchAgent |
| `dot obsidian sync` | Run sync once now |
| `dot obsidian status` | Show LaunchAgent + last log lines |
| `dot obsidian help` | This help |

## What sync does

1. `git pull --rebase --autostash`
2. If dirty → `git add -A` + commit `vault: autosync <utc>`
3. `git push`

Ignores (see vault `.gitignore`): workspace UI state, plugin `data.json` (API keys).

## Logs

- `~/Library/Logs/obsidian-vault-sync.stdout.log`
- `~/Library/Logs/obsidian-vault-sync.stderr.log`

## Override vault path

```bash
OBSIDIAN_VAULT=/path/to/vault obsidian-vault-sync
```

Or edit `OBSIDIAN_VAULT` in the LaunchAgent plist, then `dot obsidian install` again.
