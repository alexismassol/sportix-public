import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the hero section with title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Vivez le Sport');
    await expect(page.getByText('Version Démo Publique')).toBeVisible();
  });

  test('should display stats counters', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Billets vendus')).toBeVisible();
    await expect(page.getByText('Clubs partenaires')).toBeVisible();
  });

  test('should display upcoming events section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Prochains événements')).toBeVisible();
  });

  test('should display demo scan section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Testez Sport IX')).toBeVisible();
    await expect(page.getByText('Scanner un billet')).toBeVisible();
    await expect(page.getByText('Payer à la buvette')).toBeVisible();
  });

  test('should display CTA section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Créer mon compte gratuitement')).toBeVisible();
  });
});
