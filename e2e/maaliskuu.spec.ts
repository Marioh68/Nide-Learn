import { test, expect } from '@playwright/test';

// March (Taso 3) — payroll accounting smoke tests

test.describe('Maaliskuu — intro ja palkkarakenne', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Maaliskuu (Taso 3)' }).click();
  });

  test('MarIntro näyttää otsikon ja palkkarakenne-boksin', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Maaliskuu 2027 — Taso 3/ })).toBeVisible();
    await expect(page.locator('.mar-intro-palkka-box')).toBeVisible();
  });

  test('palkkarakenne-boksi sisältää 5000 Palkat -tilin', async ({ page }) => {
    await expect(page.locator('.mar-intro-palkka-box').getByText('5000 Palkat')).toBeVisible();
  });

  test('aloita-nappi siirtää harjoitusnäkymään', async ({ page }) => {
    await page.getByRole('button', { name: /Aloita maaliskuun kirjaukset/i }).click();
    await expect(page.getByRole('navigation', { name: /Tositteen edistyminen/i })).toBeVisible();
  });
});

test.describe('Maaliskuu — palkkakirjaus (mar-003)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Maaliskuu (Taso 3)' }).click();
    await page.getByRole('button', { name: /Aloita maaliskuun kirjaukset/i }).click();
    // Navigate to mar-003 (index 2 in ProgressTracker)
    const items = page.locator('.pt-item');
    await items.nth(2).click();
  });

  test('palkkakirjauksen tositekortti näyttää 1 500 € ja Pekka Korhonen', async ({ page }) => {
    await expect(page.getByText('Pekka Korhonen', { exact: true })).toBeVisible();
    const footer = page.locator('.doc-card-footer');
    await expect(footer.locator('.doc-amount')).toContainText('1 500,00');
  });

  test('oikea vastaus 5000/2960/2910 hyväksytään', async ({ page }) => {
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();

    // 5000 debet 1500
    await page.getByLabel('Tili').selectOption('5000');
    await page.getByLabel('Debet').check();
    await page.getByLabel('Summa').fill('1500');
    await page.getByRole('button', { name: 'Lisää kirjaus' }).click();

    // 2960 kredit 375
    await page.getByLabel('Tili').selectOption('2960');
    await page.getByLabel('Kredit').check();
    await page.getByLabel('Summa').fill('375');
    await page.getByRole('button', { name: 'Lisää kirjaus' }).click();

    // 2910 kredit 1125
    await page.getByLabel('Tili').selectOption('2910');
    await page.getByLabel('Kredit').check();
    await page.getByLabel('Summa').fill('1125');
    await page.getByRole('button', { name: 'Lisää kirjaus' }).click();

    await page.getByRole('button', { name: 'Tarkista' }).click();
    await expect(page.getByText('✓ Tiliristikko oikein!')).toBeVisible();
  });
});

test.describe('Maaliskuu — sotumaksukirjaus (mar-004)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Maaliskuu (Taso 3)' }).click();
    await page.getByRole('button', { name: /Aloita maaliskuun kirjaukset/i }).click();
    // Navigate to mar-004 (index 3)
    const items = page.locator('.pt-item');
    await items.nth(3).click();
  });

  test('sotumaksukortti näyttää 30 € ja Verohallinto', async ({ page }) => {
    await expect(page.getByText('Verohallinto', { exact: true })).toBeVisible();
    const footer = page.locator('.doc-card-footer');
    await expect(footer.locator('.doc-amount')).toContainText('30,00');
  });
});
