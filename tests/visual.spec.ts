import { test, expect } from '@playwright/test';

const pages = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'now', path: '/now' },
  { name: 'blog-post', path: '/blog/triangulating-truth-marketing-measurement' },
];

for (const { name, path } of pages) {
  test(`${name} — full page`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    // Scroll to bottom and back to trigger lazy-loaded images
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    // Wait for all images (with 5s timeout per image)
    await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return Promise.all(imgs.map(img => {
        if (img.complete && img.naturalHeight > 0) return Promise.resolve();
        return Promise.race([
          new Promise<void>(r => { img.addEventListener('load', () => r()); img.addEventListener('error', () => r()); }),
          new Promise<void>(r => setTimeout(r, 5000)),
        ]);
      }));
    });
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
