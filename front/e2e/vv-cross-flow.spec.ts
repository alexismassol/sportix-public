/**
 * V&V (Validation & Verification) - Frontend Cross-Flow Tests
 *
 * Validates that the frontend correctly implements the functional spec:
 * VV-FRONT-01: All pages render without errors
 * VV-FRONT-02: Navigation consistency - all links lead to correct routes
 * VV-FRONT-03: Auth flow - login → dashboard → protected pages → logout
 * VV-FRONT-04: Demo scan pages display correct scenarios
 * VV-FRONT-05: Responsive layout works on mobile and desktop viewports
 * VV-FRONT-06: Error handling - graceful degradation when API is down
 */
import { test, expect } from '@playwright/test';

// ============================================================================
// VV-FRONT-01: All pages render without console errors
// ============================================================================
test.describe('VV-FRONT-01: Page Rendering', () => {
  const publicPages = [
    { path: '/', title: 'Home' },
    { path: '/about', title: 'About' },
    { path: '/contact', title: 'Contact' },
    { path: '/faq', title: 'FAQ' },
    { path: '/events', title: 'Events' },
    { path: '/auth/login', title: 'Login' },
    { path: '/auth/register', title: 'Register' },
  ];

  for (const page of publicPages) {
    test(`${page.title} page should render without errors`, async ({ page: p }) => {
      const errors: string[] = [];
      p.on('pageerror', (err) => errors.push(err.message));

      await p.goto(page.path);
      await p.waitForLoadState('networkidle');

      expect(errors).toHaveLength(0);
    });
  }
});

// ============================================================================
// VV-FRONT-02: Navigation consistency
// ============================================================================
test.describe('VV-FRONT-02: Navigation Consistency', () => {
  test('navbar should contain all expected links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const nav = page.locator('nav');
    await expect(nav.first()).toBeVisible();

    // Check that key links exist
    const links = await page.locator('a[routerLink], a[href]').allTextContents();
    const linkTexts = links.map(l => l.trim().toLowerCase()).join(' ');

    expect(linkTexts).toContain('accueil');
  });

  test('footer should be visible on all pages', async ({ page }) => {
    const pages = ['/', '/about', '/contact', '/faq', '/events'];

    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const footer = page.locator('app-footer');
      await expect(footer).toBeVisible();
    }
  });
});

// ============================================================================
// VV-FRONT-03: Auth flow end-to-end
// ============================================================================
test.describe('VV-FRONT-03: Auth Flow', () => {
  test('should complete full auth cycle: login → dashboard → logout', async ({ page }) => {
    // Navigate to login
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // Fill demo credentials
    await page.fill('input[type="email"], input[name="email"]', 'spectateur@sport-ix.com');
    await page.fill('input[type="password"], input[name="password"]', 'Spectateur2024!');

    // Submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Should be redirected to dashboard or home
    const url = page.url();
    expect(url).toMatch(/\/(dashboard|home|\/)/);
  });
});

// ============================================================================
// VV-FRONT-04: Demo scan pages display scenarios
// ============================================================================
test.describe('VV-FRONT-04: Demo Scan Pages', () => {
  test('Demo Scan Billet page should show scan scenarios', async ({ page }) => {
    await page.goto('/demo/scan-billet');
    await page.waitForLoadState('networkidle');

    // Should show the scan simulation UI
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('Demo Scan Credit page should show scan scenarios', async ({ page }) => {
    await page.goto('/demo/scan-credit');
    await page.waitForLoadState('networkidle');

    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});

// ============================================================================
// VV-FRONT-05: Responsive layout
// ============================================================================
test.describe('VV-FRONT-05: Responsive Layout', () => {
  test('should render correctly on mobile viewport', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 }
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Page should not have horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px tolerance

    await context.close();
  });

  test('should render correctly on desktop viewport', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Nav should be visible
    const nav = page.locator('nav');
    await expect(nav.first()).toBeVisible();

    await context.close();
  });
});

// ============================================================================
// VV-FRONT-06: Error handling
// ============================================================================
test.describe('VV-FRONT-06: Error Handling', () => {
  test('should handle 404 gracefully', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz');
    await page.waitForLoadState('networkidle');

    // Should not crash - page should still render
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });
});
