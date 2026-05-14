import { test, expect } from '@playwright/test';

// February (Taso 2) — ALV multi-rate + käyttöomaisuus smoke tests

test.describe('Helmikuu — intro ja ALV-kannat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Helmikuu (Taso 2)' }).click();
  });

  test('FebIntro näyttää otsikon ja ALV-kannat-boksin', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Helmikuu 2027 — Taso 2/ })).toBeVisible();
    // ALV-kannat box with three rates
    await expect(page.getByText('25,5 %')).toBeVisible();
    await expect(page.getByText('13,5 %')).toBeVisible();
    await expect(page.getByText('10,0 %')).toBeVisible();
  });

  test('aloita-nappi siirtää harjoitusnäkymään', async ({ page }) => {
    await page.getByRole('button', { name: /Aloita helmikuun kirjaukset/i }).click();
    // ProgressTracker and first exercise should be visible
    await expect(page.getByRole('navigation', { name: /Tositteen edistyminen/i })).toBeVisible();
  });
});

test.describe('Helmikuu — ALV 13,5 % (kirjakauppa)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Helmikuu (Taso 2)' }).click();
    await page.getByRole('button', { name: /Aloita helmikuun kirjaukset/i }).click();
    // Navigate to feb-002 (index 1 in ProgressTracker)
    const items = page.locator('.pt-item');
    await items.nth(1).click();
  });

  test('DocumentCard näyttää ALV 13,5 % suomenkielisellä desimaalimerkillä', async ({ page }) => {
    await expect(page.getByText('ALV 13,5 %')).toBeVisible();
    await expect(page.getByText('45,40 €')).toBeVisible();
    // Net amount
    await expect(page.getByText('40,00 €')).toBeVisible();
    // VAT amount
    await expect(page.getByText('5,40 €')).toBeVisible();
  });
});

test.describe('Helmikuu — ALV 10 % (lehti)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Helmikuu (Taso 2)' }).click();
    await page.getByRole('button', { name: /Aloita helmikuun kirjaukset/i }).click();
    // Navigate to feb-004 (index 3)
    const items = page.locator('.pt-item');
    await items.nth(3).click();
  });

  test('DocumentCard näyttää ALV 10 % suomenkielisellä merkillä', async ({ page }) => {
    await expect(page.getByText('ALV 10 %')).toBeVisible();
    await expect(page.getByText('22,00 €')).toBeVisible();
    await expect(page.getByText('2,00 €')).toBeVisible();
  });
});

test.describe('Helmikuu — käyttöomaisuus (laptop)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Helmikuu (Taso 2)' }).click();
    await page.getByRole('button', { name: /Aloita helmikuun kirjaukset/i }).click();
    // Navigate to feb-005 (index 4)
    const items = page.locator('.pt-item');
    await items.nth(4).click();
  });

  test('käyttöomaisuuslasku näyttää 1 506 € ostovelkana', async ({ page }) => {
    await expect(page.getByText('1 506,00 €')).toBeVisible();
    await expect(page.getByText(/TechStore/i)).toBeVisible();
  });

  test('oikea vastaus 1200/2920/2520 hyväksytään tiliristikossa', async ({ page }) => {
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();

    // 1200 debet 1200
    await page.getByLabel('Tili').selectOption('1200');
    await page.getByLabel('Debet').check();
    await page.getByLabel('Summa').fill('1200');
    await page.getByRole('button', { name: 'Lisää kirjaus' }).click();

    // 2920 debet 306
    await page.getByLabel('Tili').selectOption('2920');
    await page.getByLabel('Debet').check();
    await page.getByLabel('Summa').fill('306');
    await page.getByRole('button', { name: 'Lisää kirjaus' }).click();

    // 2520 kredit 1506
    await page.getByLabel('Tili').selectOption('2520');
    await page.getByLabel('Kredit').check();
    await page.getByLabel('Summa').fill('1506');
    await page.getByRole('button', { name: 'Lisää kirjaus' }).click();

    await page.getByRole('button', { name: 'Tarkista' }).click();
    await expect(page.getByText('✓ Tiliristikko oikein!')).toBeVisible();
  });
});

test.describe('Helmikuu — poisto (muistiotosite)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Helmikuu (Taso 2)' }).click();
    await page.getByRole('button', { name: /Aloita helmikuun kirjaukset/i }).click();
    // Navigate to feb-006 (index 5)
    const items = page.locator('.pt-item');
    await items.nth(5).click();
  });

  test('poistokortti näyttää 20 € ja tyypin Muistiotosite', async ({ page }) => {
    await expect(page.getByText('Muistiotosite')).toBeVisible();
    await expect(page.getByText('20,00 €')).toBeVisible();
  });
});
