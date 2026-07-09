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
