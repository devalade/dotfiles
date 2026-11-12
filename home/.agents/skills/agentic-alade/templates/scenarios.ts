/**
 * Scenario matrix harness. No dependencies.
 *
 *   pnpm tsx scripts/scenarios.ts
 *   node --experimental-strip-types scripts/scenarios.ts   # Node 22.18+
 *
 * The point is not to run the app here. The point is to fail the build when a
 * state, an actor, or a floor case has no covering transition. Behaviour lives in
 * `docs/scenarios.md` and in Playwright specs that reference row ids.
 *
 * The starter rows below describe one real flow. Replace them, keep the floor.
 */

export type Actor = 'anonymous' | 'stranger' | 'member' | 'owner' | 'service';

export type Floor =
  | 'success'
  | 'validation-error'
  | 'server-error'
  | 'network-failure'
  | 'signed-out'
  | 'wrong-role'
  | 'expired-session'
  | 'duplicate-submit'
  | 'concurrent-write'
  | 'empty-state'
  | 'slow-load'
  | 'rate-limited';

export interface Scenario {
  /** Stable id, used by the spec and the screenshots. e.g. `rename.owner.success` */
  id: string;
  actor: Actor;
  from: string;
  action: string;
  to: string;
  floor: Floor;
  /** Read back from the database, not the screen. */
  sideEffect: string;
  /** `false` when the row is knowingly not covered. Waivers need a reason. */
  covered: boolean;
  waiver?: string;
}

export const FLOOR: Floor[] = [
  'success',
  'validation-error',
  'server-error',
  'network-failure',
  'signed-out',
  'wrong-role',
  'expired-session',
  'duplicate-submit',
  'concurrent-write',
  'empty-state',
  'slow-load',
  'rate-limited',
];

export const ACTORS: Actor[] = ['anonymous', 'stranger', 'member', 'owner', 'service'];

/** States a session can start in. Everything else must be entered by a row. */
export const START = new Set(['signed-out']);

/** States that end a flow. Everything else must be left by a row. */
export const TERMINAL = new Set([
  'signed-in',
  'renamed',
  'unchanged',
  'denied',
  'redirected',
  'provisioned',
]);

export const scenarios: Scenario[] = [
  {
    id: 'session.sign-in',
    actor: 'anonymous',
    from: 'signed-out',
    action: 'sign in with a valid magic link',
    to: 'signed-in',
    floor: 'success',
    sideEffect: 'sessions row created, cookie set',
    covered: true,
  },
  // Rename flow.
  {
    id: 'rename.owner.success',
    actor: 'owner',
    from: 'signed-in',
    action: 'rename workspace',
    to: 'renamed',
    floor: 'success',
    sideEffect: 'workspaces.name updated, audit row written',
    covered: true,
  },
  {
    id: 'rename.owner.validation-error',
    actor: 'owner',
    from: 'signed-in',
    action: 'rename to an empty or 200 char name',
    to: 'unchanged',
    floor: 'validation-error',
    sideEffect: 'no write, field level message',
    covered: true,
  },
  {
    id: 'rename.owner.server-error',
    actor: 'owner',
    from: 'signed-in',
    action: 'rename while the server fn throws',
    to: 'unchanged',
    floor: 'server-error',
    sideEffect: 'no write, retry succeeds',
    covered: true,
  },
  {
    id: 'rename.owner.network-failure',
    actor: 'owner',
    from: 'signed-in',
    action: 'rename, then drop the response',
    to: 'unchanged',
    floor: 'network-failure',
    sideEffect: 'one write at most, reload reads it back',
    covered: true,
  },
  {
    id: 'rename.owner.slow-load',
    actor: 'owner',
    from: 'signed-in',
    action: 'open settings on a slow 3G profile',
    to: 'unchanged',
    floor: 'slow-load',
    sideEffect: 'skeleton first, then seeded values',
    covered: true,
  },
  {
    id: 'rename.owner.duplicate-submit',
    actor: 'owner',
    from: 'signed-in',
    action: 'click save twice in the same second',
    to: 'renamed',
    floor: 'duplicate-submit',
    sideEffect: 'exactly one audit row',
    covered: true,
  },
  {
    id: 'rename.owner.concurrent-write',
    actor: 'owner',
    from: 'signed-in',
    action: 'rename in two tabs, second write loses',
    to: 'renamed',
    floor: 'concurrent-write',
    sideEffect: 'last write wins or 409, never a torn row',
    covered: true,
  },
  {
    id: 'rename.owner.rate-limited',
    actor: 'owner',
    from: 'signed-in',
    action: 'rename 30 times in a minute',
    to: 'unchanged',
    floor: 'rate-limited',
    sideEffect: 'blocked with a readable message',
    covered: true,
  },
  {
    id: 'rename.owner.expired-session',
    actor: 'owner',
    from: 'signed-in',
    action: 'rename after the session expires',
    to: 'redirected',
    floor: 'expired-session',
    sideEffect: 'no write, sign in returns to the form',
    covered: true,
  },
  {
    id: 'rename.member.denied',
    actor: 'member',
    from: 'signed-in',
    action: 'rename workspace with a read only role',
    to: 'denied',
    floor: 'wrong-role',
    sideEffect: 'server fn 403, no write',
    covered: true,
  },
  {
    id: 'rename.stranger.denied',
    actor: 'stranger',
    from: 'signed-in',
    action: 'rename another tenant workspace by id',
    to: 'denied',
    floor: 'wrong-role',
    sideEffect: '404 not 403, no row fetched',
    covered: true,
  },
  {
    id: 'rename.anonymous.redirect',
    actor: 'anonymous',
    from: 'signed-out',
    action: 'open /settings',
    to: 'redirected',
    floor: 'signed-out',
    sideEffect: 'redirect to sign in, no fetch',
    covered: true,
  },
  // A second flow keeps the empty state and the service actor honest.
  {
    id: 'members.owner.empty-state',
    actor: 'owner',
    from: 'signed-in',
    action: 'open the members list on a fresh workspace',
    to: 'unchanged',
    floor: 'empty-state',
    sideEffect: 'empty state, invite CTA, zero rows fetched',
    covered: true,
  },
  {
    id: 'workspace.service.provision',
    actor: 'service',
    from: 'signed-in',
    action: 'provision a workspace after payment webhook',
    to: 'provisioned',
    floor: 'success',
    sideEffect: 'idempotent on replay, one workspace per payment id',
    covered: true,
  },
];

export function findProblems(rows: Scenario[] = scenarios): string[] {
  const problems: string[] = [];
  const states = new Set<string>();
  const floors = new Set<Floor>();
  const ids = new Set<string>();

  for (const row of rows) {
    if (ids.has(row.id)) problems.push(`duplicate id: ${row.id}`);
    ids.add(row.id);
    states.add(row.from);
    states.add(row.to);
    floors.add(row.floor);
    if (!row.covered && !row.waiver) problems.push(`uncovered without waiver: ${row.id}`);
  }

  for (const floor of FLOOR) {
    if (!floors.has(floor)) problems.push(`floor case missing from matrix: ${floor}`);
  }

  for (const actor of ACTORS) {
    if (!rows.some((row) => row.actor === actor)) {
      problems.push(`actor never exercised: ${actor}`);
    }
  }

  for (const state of states) {
    const enters = rows.some((row) => row.to === state);
    const leaves = rows.some((row) => row.from === state);
    if (!START.has(state) && !enters) problems.push(`state never entered: ${state}`);
    if (!TERMINAL.has(state) && !leaves) {
      problems.push(`state never left: ${state} (add it to TERMINAL if that is true)`);
    }
  }

  return problems;
}

const problems = findProblems();
if (problems.length > 0) {
  console.error(`scenario matrix: ${problems.length} problem(s)`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`scenario matrix: ${scenarios.length} rows, floor ${FLOOR.length}/${FLOOR.length}`);
