import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Structural assertions (run per-device, catch broken layouts) ---

const pages = [
  {
    name: 'home',
    path: '/',
    selectors: ['.home__main', '.home__sidebar', '.home__articles', '.header'],
  },
  {
    name: 'about',
    path: '/about',
    selectors: ['.about', '.about__photo', '.about__content', '.header', '.skill-icon-grid', '.timeline', '.book-grid'],
  },
  {
    name: 'now',
    path: '/now',
    selectors: ['.now', '.now__header', '.activity-calendar', '.oura-grid', '.now-reading', '.now-log', '.header'],
  },
  {
    name: 'blog-post',
    path: '/blog/triangulating-truth-marketing-measurement',
    selectors: ['.post', '.post__header', '.post__title', '.post__body', '.post__footer', '.post__bio', '.post__nav', '.header'],
  },
];

for (const pg of pages) {
  test.describe(`${pg.name} — structural`, () => {

    test('no horizontal overflow', async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, 'Page has horizontal scroll — something is overflowing').toBe(false);
    });

    test('all key sections render', async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForLoadState('networkidle');
      for (const sel of pg.selectors) {
        const el = page.locator(sel).first();
        await expect(el, `Missing element: ${sel}`).toBeVisible();
      }
    });

    test('no zero-height sections', async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForLoadState('networkidle');
      for (const sel of pg.selectors) {
        const box = await page.locator(sel).first().boundingBox();
        expect(box, `${sel} has no bounding box`).not.toBeNull();
        expect(box!.height, `${sel} has zero height`).toBeGreaterThan(0);
        expect(box!.width, `${sel} has zero width`).toBeGreaterThan(0);
      }
    });

    test('no elements clipped off-screen left', async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForLoadState('networkidle');
      const viewport = page.viewportSize()!;
      for (const sel of pg.selectors) {
        const box = await page.locator(sel).first().boundingBox();
        if (!box) continue;
        expect(box.x + box.width, `${sel} is clipped off-screen left`).toBeGreaterThan(0);
        expect(box.x, `${sel} starts beyond viewport right`).toBeLessThan(viewport.width * 2);
      }
    });
  });
}

// --- Cross-browser metric collection ---

const metricsDir = path.join(__dirname, 'metrics');
const screenshotsDir = path.join(metricsDir, 'shots');

interface ElementMetrics {
  selector: string;
  width: number;
  height: number;
  x: number;
  y: number;
  widthRatio: number;
}

interface PageMetrics {
  page: string;
  viewport: { width: number; height: number };
  pageHeight: number;
  elements: ElementMetrics[];
  screenshot: string;
}

for (const pg of pages) {
  test(`${pg.name} — collect metrics`, async ({ page }, testInfo) => {
    await page.goto(pg.path);
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

    const viewport = page.viewportSize()!;
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);

    const elements: ElementMetrics[] = [];
    for (const sel of pg.selectors) {
      const box = await page.locator(sel).first().boundingBox();
      if (box) {
        elements.push({
          selector: sel,
          width: Math.round(box.width),
          height: Math.round(box.height),
          x: Math.round(box.x),
          y: Math.round(box.y),
          widthRatio: parseFloat((box.width / viewport.width).toFixed(3)),
        });
      }
    }

    fs.mkdirSync(screenshotsDir, { recursive: true });
    const deviceSlug = testInfo.project.name.replace(/\s+/g, '-');
    const shotFilename = `${pg.name}-${deviceSlug}.png`;
    await page.screenshot({ path: path.join(screenshotsDir, shotFilename), fullPage: true });

    const metrics: PageMetrics = { page: pg.name, viewport, pageHeight, elements, screenshot: `shots/${shotFilename}` };
    const filename = `${pg.name}-${deviceSlug}.json`;
    fs.writeFileSync(path.join(metricsDir, filename), JSON.stringify(metrics, null, 2));
  });
}

// --- Cross-browser comparison + HTML report ---

test.describe('cross-browser comparison', () => {
  test('compare layout metrics across browsers', async () => {
    if (!fs.existsSync(metricsDir)) {
      test.skip();
      return;
    }

    const files = fs.readdirSync(metricsDir).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
      test.skip();
      return;
    }

    // Load all metrics
    const allMetrics: { device: string; metrics: PageMetrics }[] = [];
    const byPage: Record<string, { device: string; metrics: PageMetrics }[]> = {};
    for (const file of files) {
      const metrics: PageMetrics = JSON.parse(fs.readFileSync(path.join(metricsDir, file), 'utf-8'));
      const device = file.replace(`${metrics.page}-`, '').replace('.json', '');
      allMetrics.push({ device, metrics });
      if (!byPage[metrics.page]) byPage[metrics.page] = [];
      byPage[metrics.page].push({ device, metrics });
    }

    interface Issue {
      severity: string;
      page: string;
      detail: string;
      devices: [string, string];
    }

    const issues: Issue[] = [];

    for (const [pageName, entries] of Object.entries(byPage)) {
      const groups: Record<string, typeof entries> = {};
      for (const entry of entries) {
        const bucket = entry.metrics.viewport.width >= 1024 ? 'desktop'
          : entry.metrics.viewport.width >= 700 ? 'tablet'
          : 'mobile';
        if (!groups[bucket]) groups[bucket] = [];
        groups[bucket].push(entry);
      }

      for (const [bucket, group] of Object.entries(groups)) {
        if (group.length < 2) continue;

        const reference = group[0];
        for (let i = 1; i < group.length; i++) {
          const compare = group[i];

          const heightDiff = Math.abs(reference.metrics.pageHeight - compare.metrics.pageHeight);
          const heightPct = heightDiff / reference.metrics.pageHeight;
          if (heightPct > 0.15) {
            issues.push({
              severity: heightPct > 0.3 ? 'MAJOR' : 'MINOR',
              page: pageName,
              detail: `[${bucket}] Page height differs ${(heightPct * 100).toFixed(1)}% — ${reference.device}: ${reference.metrics.pageHeight}px vs ${compare.device}: ${compare.metrics.pageHeight}px`,
              devices: [reference.device, compare.device],
            });
          }

          for (const refEl of reference.metrics.elements) {
            const cmpEl = compare.metrics.elements.find(e => e.selector === refEl.selector);
            if (!cmpEl) {
              issues.push({
                severity: 'CATASTROPHIC',
                page: pageName,
                detail: `[${bucket}] ${refEl.selector} exists on ${reference.device} but missing on ${compare.device}`,
                devices: [reference.device, compare.device],
              });
              continue;
            }

            const widthRatioDiff = Math.abs(refEl.widthRatio - cmpEl.widthRatio);
            if (widthRatioDiff > 0.15) {
              issues.push({
                severity: widthRatioDiff > 0.3 ? 'MAJOR' : 'MINOR',
                page: pageName,
                detail: `[${bucket}] ${refEl.selector} width ratio — ${reference.device}: ${refEl.widthRatio} vs ${compare.device}: ${cmpEl.widthRatio}`,
                devices: [reference.device, compare.device],
              });
            }

            if (refEl.height > 0) {
              const hDiff = Math.abs(refEl.height - cmpEl.height) / refEl.height;
              if (hDiff > 0.25) {
                issues.push({
                  severity: hDiff > 0.5 ? 'MAJOR' : 'MINOR',
                  page: pageName,
                  detail: `[${bucket}] ${refEl.selector} height differs ${(hDiff * 100).toFixed(1)}% — ${reference.device}: ${refEl.height}px vs ${compare.device}: ${cmpEl.height}px`,
                  devices: [reference.device, compare.device],
                });
              }
            }
          }
        }
      }
    }

    // --- Generate HTML report ---
    const timestamp = new Date().toLocaleString();
    const catastrophic = issues.filter(i => i.severity === 'CATASTROPHIC');
    const major = issues.filter(i => i.severity === 'MAJOR');
    const minor = issues.filter(i => i.severity === 'MINOR');

    function issueCard(issue: Issue): string {
      const colors: Record<string, string> = { CATASTROPHIC: '#dc2626', MAJOR: '#ea580c', MINOR: '#ca8a04' };
      const bg: Record<string, string> = { CATASTROPHIC: '#fef2f2', MAJOR: '#fff7ed', MINOR: '#fefce8' };
      const entry1 = byPage[issue.page]?.find(e => e.device === issue.devices[0]);
      const entry2 = byPage[issue.page]?.find(e => e.device === issue.devices[1]);

      return `
        <div class="issue" style="border-left: 4px solid ${colors[issue.severity]}; background: ${bg[issue.severity]};">
          <div class="issue-header">
            <span class="badge" style="background: ${colors[issue.severity]};">${issue.severity}</span>
            <span class="issue-page">/${issue.page}</span>
          </div>
          <p class="issue-detail">${issue.detail}</p>
          <div class="screenshots">
            ${entry1?.metrics.screenshot ? `<div class="shot"><div class="shot-label">${issue.devices[0]}<br><span class="shot-dims">${entry1.metrics.viewport.width}×${entry1.metrics.viewport.height}</span></div><img src="${entry1.metrics.screenshot}" alt="${issue.devices[0]}"></div>` : ''}
            ${entry2?.metrics.screenshot ? `<div class="shot"><div class="shot-label">${issue.devices[1]}<br><span class="shot-dims">${entry2.metrics.viewport.width}×${entry2.metrics.viewport.height}</span></div><img src="${entry2.metrics.screenshot}" alt="${issue.devices[1]}"></div>` : ''}
          </div>
        </div>`;
    }

    function pageGallery(pageName: string, entries: { device: string; metrics: PageMetrics }[]): string {
      const sorted = [...entries].sort((a, b) => a.metrics.viewport.width - b.metrics.viewport.width);
      return `
        <div class="gallery-section">
          <h3>/${pageName}</h3>
          <div class="gallery">
            ${sorted.map(e => `
              <div class="shot">
                <div class="shot-label">${e.device}<br><span class="shot-dims">${e.metrics.viewport.width}×${e.metrics.viewport.height} · ${e.metrics.pageHeight}px tall</span></div>
                <img src="${e.metrics.screenshot}" alt="${e.device}">
              </div>
            `).join('')}
          </div>
        </div>`;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Layout Comparison Report</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; padding: 2rem; line-height: 1.5; }
  h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
  .meta { color: #64748b; font-size: 0.85rem; margin-bottom: 2rem; }
  .summary { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
  .summary-card { padding: 1rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 1.2rem; }
  .summary-card span { display: block; font-size: 0.75rem; font-weight: 400; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
  .sc-cat { background: #fef2f2; color: #dc2626; }
  .sc-maj { background: #fff7ed; color: #ea580c; }
  .sc-min { background: #fefce8; color: #ca8a04; }
  .sc-pass { background: #f0fdf4; color: #16a34a; }
  h2 { font-size: 1.2rem; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0; }
  .issue { padding: 1rem 1.25rem; margin-bottom: 1rem; border-radius: 6px; }
  .issue-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
  .badge { color: white; font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  .issue-page { font-weight: 600; font-size: 0.9rem; }
  .issue-detail { font-size: 0.85rem; color: #475569; margin-bottom: 0.75rem; }
  .screenshots { display: flex; gap: 1rem; overflow-x: auto; }
  .gallery { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem; }
  .gallery-section { margin-bottom: 2rem; }
  .gallery-section h3 { font-size: 1rem; margin-bottom: 0.75rem; }
  .shot { flex-shrink: 0; }
  .shot img { max-height: 500px; width: auto; border: 1px solid #e2e8f0; border-radius: 4px; display: block; cursor: pointer; transition: opacity 0.15s; }
  .shot img:hover { opacity: 0.85; }
  .shot-label { font-size: 0.75rem; font-weight: 600; margin-bottom: 0.35rem; color: #334155; }
  .shot-dims { font-weight: 400; color: #94a3b8; }
  .no-issues { padding: 2rem; background: #f0fdf4; border-radius: 8px; color: #16a34a; font-weight: 600; text-align: center; }
  .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000; justify-content: center; align-items: flex-start; padding: 2rem; overflow-y: auto; cursor: zoom-out; }
  .modal-overlay.is-open { display: flex; }
  .modal-overlay img { max-width: 95vw; max-height: none; width: auto; border-radius: 4px; cursor: default; }
  .modal-caption { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); color: #e2e8f0; font-size: 0.85rem; font-weight: 600; background: rgba(0,0,0,0.6); padding: 0.4rem 1rem; border-radius: 6px; pointer-events: none; white-space: nowrap; }
  .modal-close { position: fixed; top: 1rem; right: 1.5rem; color: white; background: rgba(0,0,0,0.5); border: none; font-size: 1.5rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 1001; }
  .modal-close:hover { background: rgba(0,0,0,0.8); }
</style>
</head>
<body>
  <h1>Layout Comparison Report</h1>
  <p class="meta">${timestamp} · ${allMetrics.length} captures across ${Object.keys(byPage).length} pages</p>

  <div class="summary">
    ${catastrophic.length > 0 ? `<div class="summary-card sc-cat"><span>Catastrophic</span>${catastrophic.length}</div>` : ''}
    ${major.length > 0 ? `<div class="summary-card sc-maj"><span>Major</span>${major.length}</div>` : ''}
    ${minor.length > 0 ? `<div class="summary-card sc-min"><span>Minor</span>${minor.length}</div>` : ''}
    ${issues.length === 0 ? '<div class="summary-card sc-pass"><span>Status</span>All clear</div>' : ''}
    <div class="summary-card" style="background:#f1f5f9; color:#334155;"><span>Devices</span>${new Set(allMetrics.map(m => m.device)).size}</div>
    <div class="summary-card" style="background:#f1f5f9; color:#334155;"><span>Pages</span>${Object.keys(byPage).length}</div>
  </div>

  ${issues.length > 0 ? `
    <h2>Deviations</h2>
    ${[...catastrophic, ...major, ...minor].map(issueCard).join('')}
  ` : '<div class="no-issues">No cross-browser layout deviations detected.</div>'}

  <h2>All Screenshots</h2>
  ${Object.entries(byPage).map(([name, entries]) => pageGallery(name, entries)).join('')}

  <div class="modal-overlay" id="modal">
    <button class="modal-close" id="modal-close">&times;</button>
    <img id="modal-img" src="" alt="">
    <div class="modal-caption" id="modal-caption"></div>
  </div>

  <script>
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');

    document.querySelectorAll('.shot img').forEach(img => {
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modalCaption.textContent = img.alt || img.closest('.shot')?.querySelector('.shot-label')?.textContent || '';
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.id === 'modal-close') closeModal(); });
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(metricsDir, 'report.html'), html);

    // Also save text report
    if (issues.length > 0) {
      const report = [
        `Cross-browser layout deviations found:\n`,
        ...catastrophic.map(i => `  CATASTROPHIC: ${i.page} — ${i.detail}`),
        ...major.map(i => `  MAJOR: ${i.page} — ${i.detail}`),
        ...minor.map(i => `  MINOR: ${i.page} — ${i.detail}`),
        `\nTotal: ${catastrophic.length} catastrophic, ${major.length} major, ${minor.length} minor`,
      ].join('\n');
      fs.writeFileSync(path.join(metricsDir, 'comparison-report.txt'), report);

      // Fail on catastrophic only
      expect(catastrophic.length, report).toBe(0);
    }
  });
});
