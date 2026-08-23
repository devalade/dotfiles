import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const DEEPSEEK_MODEL = "deepseek-v4-flash";
const MAX_THINKING_LEVEL = "max" as Parameters<ExtensionAPI["setThinkingLevel"]>[0];
const MAX_BATCH_FILES = 16;
const MAX_FILE_BYTES = 200_000;
const MAX_TOTAL_BYTES = 1_000_000;
const BATCH_READ_PARAMETERS = {
	type: "object",
	properties: {
		paths: {
			type: "array",
			items: { type: "string", description: "Project-relative file path" },
			minItems: 2,
			maxItems: MAX_BATCH_FILES,
		},
	},
	required: ["paths"],
	additionalProperties: false,
} as const;

const EXECUTION_POLICY = `
## Execution discipline

You are an execution-focused coding worker. Optimize for a correct, verified change with low tool overhead.

- First identify the smallest exact set of files and project instructions needed for the task.
- Batch-read those files and relevant docs in as few tool calls as practical; do not browse the whole repository or reread unchanged files.
- Keep the change narrowly scoped and preserve unrelated user work.
- After editing, run the narrowest relevant typecheck, lint, and tests. If a check fails, inspect the exact failure and repair it instead of adding debug logging or fixed sleeps.
- Use polling with a bounded timeout only when the system under test is genuinely asynchronous.
- Before finishing, report the files changed, checks run, any remaining blocker, and the active model/thinking level.
`;

function isDeepSeek(ctx: ExtensionContext): boolean {
	const model = ctx.model;
	return model?.provider === "opencode-go" && model.id === DEEPSEEK_MODEL;
}

function enforceBestThinking(pi: ExtensionAPI, ctx: ExtensionContext): void {
	if (!isDeepSeek(ctx)) return;

	// Pi clamps this to the model's supported maximum. For DeepSeek this keeps
	// the configured worker at its highest available reasoning level.
	pi.setThinkingLevel(MAX_THINKING_LEVEL);
	ctx.ui.setStatus(
		"deepseek-execution",
		`DeepSeek · ${pi.getThinkingLevel()} (max supported) · ${ctx.model?.id ?? DEEPSEEK_MODEL}`,
	);
}

function projectPath(input: string): string | null {
	const root = resolve(process.cwd());
	const candidate = resolve(root, input);
	const pathFromRoot = relative(root, candidate);

	if (pathFromRoot === "" || (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== ".." && !isAbsolute(pathFromRoot))) {
		return candidate;
	}

	return null;
}

export default function deepseekExecution(pi: ExtensionAPI) {
	pi.registerTool({
		name: "batch_read",
		label: "Batch Read",
		description:
			"Read multiple known text files from the current project in one call. Use this when two or more exact source, test, or documentation files are relevant; use read for a single file or partial ranges.",
		parameters: BATCH_READ_PARAMETERS,
		async execute(_toolCallId, params) {
			let totalBytes = 0;
			const sections: string[] = [];

			for (const input of params.paths) {
				const filePath = projectPath(input);
				if (!filePath) {
					sections.push(`### ${input}\n[Skipped: path is outside the current project]`);
					continue;
				}

				try {
					const content = await readFile(filePath, "utf8");
					const remaining = Math.max(0, Math.min(MAX_FILE_BYTES, MAX_TOTAL_BYTES - totalBytes));
					const excerpt = content.slice(0, remaining);
					totalBytes += Buffer.byteLength(excerpt, "utf8");
					const suffix = excerpt.length < content.length ? "\n[Output truncated; use read with offsets for the remainder.]" : "";
					sections.push(`### ${input}\n${excerpt}${suffix}`);
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error);
					sections.push(`### ${input}\n[Unable to read: ${message}]`);
				}

				if (totalBytes >= MAX_TOTAL_BYTES) break;
			}

			return {
				content: [{ type: "text", text: sections.join("\n\n") }],
				details: { fileCount: sections.length, totalBytes },
			};
		},
	});

	pi.on("session_start", async (_event, ctx) => {
		enforceBestThinking(pi, ctx);
	});

	pi.on("model_select", async (_event, ctx) => {
		enforceBestThinking(pi, ctx);
	});

	pi.on("before_agent_start", async (event, ctx) => {
		enforceBestThinking(pi, ctx);

		if (!isDeepSeek(ctx)) return;

		return {
			systemPrompt: `${event.systemPrompt}\n${EXECUTION_POLICY}`,
		};
	});

	pi.registerCommand("deepseek-execution", {
		description: "Show or restore DeepSeek's strongest execution settings",
		handler: async (_args, ctx) => {
			if (!isDeepSeek(ctx)) {
				ctx.ui.notify("The active model is not opencode-go/deepseek-v4-flash.", "warning");
				return;
			}

			enforceBestThinking(pi, ctx);
			ctx.ui.notify(`DeepSeek execution mode: ${pi.getThinkingLevel()}`, "info");
		},
	});
}
