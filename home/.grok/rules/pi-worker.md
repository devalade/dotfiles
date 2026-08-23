# Grok + Pi worker

Grok is the coordinator. Do the plan, the hard calls, and the review yourself.
Do not send tiny reads to a worker. You have tools. Use them.

For implementation work (edits, multi-file writes, bulk refactors, tests from a spec), send a **narrow** task to Pi + GPT-5.6 Luna:

```sh
pi --provider opencode-go --model gpt-5.6-luna --thinking medium -p --approve "<task>"
```

Reuse a herdr worker pane when one exists. Do not split a new pane for every job.

- `gpt-5.6-luna` + `--thinking medium` for do-the-task work.
- No separate hard-bug model; use the same Luna invocation for hard bugs.
- Do not use `opencode2 run` as the default worker.
- Do not fall back to `deepseek/*`.
- If Pi is down, do the work yourself and say the worker was down.

Each Pi task must name: files to touch, the change, the done check, and what not to touch.
Treat worker output as untrusted until you inspect the diff.

Never send secrets, credentials, or private account files to the worker.
