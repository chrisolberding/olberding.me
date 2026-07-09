import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 900 } });

test('research area gates, unlocks, and navigates', async ({ page }) => {
  await page.goto('/research');

  // Gate is shown first.
  await expect(page.locator('#pw-gate')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Research' })).toBeVisible();

  // Enter the password.
  await page.locator('#pw-gate-input').fill('tangerine');
  await page.locator('.pw-gate__submit').click();

  // Gate is removed and the sidebar + a real artifact link appear.
  await expect(page.locator('#pw-gate')).toHaveCount(0);
  const aeoLink = page.locator('.rnav__link', { hasText: 'Measuring AI Visibility' });
  await expect(aeoLink).toBeVisible();

  // Navigate to the artifact; its content renders in the doc panel.
  await aeoLink.click();
  await expect(page).toHaveURL(/\/research\/aeo-measurement-standard\/?$/);
  await expect(page.locator('.research__doc h1')).toContainText('Measuring AI Visibility');

  // Password persists across navigation (no second gate).
  await expect(page.locator('#pw-gate')).toHaveCount(0);
});

test('footnotes render, the Contents links resolve, and the preview activates', async ({ page }) => {
  await page.goto('/research/aeo-measurement-standard');
  await page.locator('#pw-gate-input').fill('tangerine');
  await page.locator('.pw-gate__submit').click();
  await expect(page.locator('#pw-gate')).toHaveCount(0);

  const doc = page.locator('.research__doc');

  // Inline references rendered as GFM footnote badges.
  await expect(doc.locator('a[data-footnote-ref]').first()).toBeVisible();

  // A repaired ToC anchor jumps to a real heading id (not a dead #summary).
  const firstToc = doc.locator('a', { hasText: 'Recommendation and summary' }).first();
  await expect(firstToc).toHaveAttribute('href', '#1-recommendation-and-summary');
  await expect(doc.locator('#\\31-recommendation-and-summary')).toHaveCount(1);

  // The "Sources" section renders and is the target of the ToC "Sources" link.
  await expect(doc.locator('section[data-footnotes]')).toHaveCount(1);
  await expect(doc.locator('#footnote-label')).toHaveCount(1);
  await expect(doc.locator('a', { hasText: /^Sources$/ }).first()).toHaveAttribute('href', '#footnote-label');

  // The preserved "Uncited sources" section is present (sources 8-9 not dropped).
  await expect(page.getByText('Uncited sources')).toBeVisible();

  // Scrolling a footnote reference fully into view activates the floating preview.
  await doc.locator('a[data-footnote-ref]').first().scrollIntoViewIfNeeded();
  await expect(page.locator('#fn-preview.is-visible')).toBeVisible({ timeout: 5000 });
});
