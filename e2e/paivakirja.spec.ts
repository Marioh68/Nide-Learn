import { test, expect } from '@playwright/test';

// Päiväkirja (daybook) and TiliristikkoModal smoke tests

test.describe('Päiväkirja-välilehti', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Päiväkirja' }).click();
  });

  test('näyttää otsikon ja kausi-valitsimen', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Päiväkirja' })).toBeVisible();
    await expect(page.locator('#pv-month-sel')).toBeVisible();
  });

  test('taulukko sisältää Debet ja Kredit -sarakkeet', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'Debet' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Kredit' })).toBeVisible();
  });

  test('päiväkirja on tasapainossa oletusvalinnalla (maaliskuu)', async ({ page }) => {
    await expect(page.getByText('✓ Päiväkirja tasapainossa')).toBeVisible();
  });

  test('tilinumerot näkyvät klikattavina nappuloina', async ({ page }) => {
    const firstAccountBtn = page.locator('.pv-account-btn').first();
    await expect(firstAccountBtn).toBeVisible();
  });
});

test.describe('Päiväkirja — kuukausivalinnan vaikutus', () => {
  test('marraskuun valinnassa ei näy 2871-tiliä', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Päiväkirja' }).click();
    await page.locator('#pv-month-sel').selectOption('0');
    await expect(page.locator('.pv-account-btn', { hasText: '2871' })).not.toBeVisible();
  });

  test('maaliskuun valinnassa näkyy 5000-tili (palkat)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Päiväkirja' }).click();
    // Default is already maaliskuu (index 4)
    await expect(page.locator('.pv-account-btn', { hasText: '5000' }).first()).toBeVisible();
  });

  test('päiväkirja on tasapainossa kaikilla kuukausivalinnoilla', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Päiväkirja' }).click();
    const sel = page.locator('#pv-month-sel');
    for (const idx of ['0', '1', '2', '3', '4', '5']) {
      await sel.selectOption(idx);
      await expect(page.getByText('✓ Päiväkirja tasapainossa')).toBeVisible();
    }
  });
});

test.describe('Päiväkirja — tiliristikkomodaali', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Päiväkirja' }).click();
  });

  test('tilinumeron klikkaaminen avaa tiliristikkomodaalin', async ({ page }) => {
    await page.locator('.pv-account-btn').first().click();
    await expect(page.getByRole('dialog', { name: /Tiliristikko/i })).toBeVisible();
  });

  test('modaali näyttää Debet ja Kredit -puolet', async ({ page }) => {
    await page.locator('.pv-account-btn').first().click();
    const modal = page.getByRole('dialog', { name: /Tiliristikko/i });
    await expect(modal.getByText('Debet', { exact: true })).toBeVisible();
    await expect(modal.getByText('Kredit', { exact: true })).toBeVisible();
  });

  test('modaali sulkeutuu Escape-näppäimellä', async ({ page }) => {
    await page.locator('.pv-account-btn').first().click();
    await expect(page.getByRole('dialog', { name: /Tiliristikko/i })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: /Tiliristikko/i })).not.toBeVisible();
  });

  test('modaali sulkeutuu suljetaan ✕-napilla', async ({ page }) => {
    await page.locator('.pv-account-btn').first().click();
    const modal = page.getByRole('dialog', { name: /Tiliristikko/i });
    await modal.getByLabel('Sulje tiliristikko').click();
    await expect(modal).not.toBeVisible();
  });

  test('1910 Pankkitili -tiliristikko näyttää saldon', async ({ page }) => {
    // Click the 1910 account button
    await page.locator('.pv-account-btn', { hasText: '1910' }).first().click();
    const modal = page.getByRole('dialog', { name: /Tiliristikko.*1910/i });
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Saldo:')).toBeVisible();
  });
});
