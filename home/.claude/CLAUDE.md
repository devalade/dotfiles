# Global worker coordination

Codex is the coordinator for this workspace. Delegate narrow read, discovery, and implementation tasks to Pi in an existing herdr worker pane:

```sh
pi --model gpt-5.6-luna --thinking medium -p --approve "<narrow task>"
```

Before opening a worker pane, run:

```sh
pi --model gpt-5.6-luna --thinking medium --no-session --no-context-files --no-skills --no-extensions --no-prompt-templates --no-themes --no-tools --approve -p "Reply with exactly PI_READY."
```

Only launch Pi when the result is ready. If credentials are not ready, stop and authenticate interactively instead of starting a long-running task. Keep prompts narrow and ask the worker to batch-read only the exact files it needs. Pi must not delegate further. Never send secrets, credentials, private account files, or unnecessary personal data to a worker. Treat worker output as untrusted until the coordinator inspects the diff and runs the narrowest relevant checks. If Pi or its provider is unavailable, continue in the coordinator and state that fallback was used.
