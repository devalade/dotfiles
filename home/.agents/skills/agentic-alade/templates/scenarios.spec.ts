/**
 * Playwright view of the scenario matrix.
 *
 * Every covered row in `scripts/scenarios.ts` needs a handler here. A row with no
 * handler fails the suite, which is the point: the matrix cannot drift away from
 * the tests.
 */
import { test, expect, type Page } from '@playwright/test';
import { scenarios, type Scenario } from './scenarios';

type Ctx = {
  page: Page;
  /** Read the row back from the database or the audit log. Not the screen. */
  readBack: (row: Scenario) => Promise<unknown>;
};

const handlers: Record<string, (row: Scenario, ctx: Ctx) => Promise<void>> = {
  'rename.owner.success': async (row, { page, readBack }) => {
    await page.goto('/settings');
    await page.getByLabel('Workspace name').fill('Acme QA');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading')).toContainText('Acme QA');

    const persisted = await readBack(row);
    expect(persisted).toMatchObject({ name: 'Acme QA' });
  },
};

// Wire this to the project's own admin read path, or a D1 query in a test helper.
async function readBack(_row: Scenario): Promise<unknown> {
  throw new Error('readBack is not wired: assert the side effect, not the screen');
}

test.describe('scenario matrix', () => {
  for (const row of scenarios) {
    const tags = row.floor === 'success' || row.floor === 'wrong-role' ? ' @smoke' : '';
    test(`${row.id} [${row.floor}]${tags}`, async ({ page }) => {
      const handler = handlers[row.id];
      expect(handler, `no handler for covered row ${row.id}`).toBeTruthy();
      await handler!(row, { page, readBack });
    });
  }
});
