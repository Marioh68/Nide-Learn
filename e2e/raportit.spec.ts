import { test, expect } from '@playwright/test';

// Report view smoke tests — trial balance, P&L, balance sheet

test.describe('Raportit-välilehti', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Raportit' }).click();
  });

  test('näyttää otsikot ja kolme raporttiosiota', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Raportit' })).toBeVisible();
    await expect(page.getByText('Pääkirja-koeajo')).toBeVisible();
    await expect(page.getByText('Tuloslaskelma')).toBeVisible();
    await expect(page.getByText('Tase')).toBeVisible();
  });

  test('tase on tasapainossa oletusvalinnalla (helmikuu)', async ({ page }) => {
    await expect(page.getByText('✓ Tase tasapainossa')).toBeVisible();
  });

  test('kuukauden valinta -pudotusvalikko on olemassa', async ({ page }) => {
    const sel = page.locator('#report-month-sel');
    await expect(sel).toBeVisible();
    await expect(sel.locator('option:checked')).toContainText('Helmikuu');
  });
});

test.describe('Raportit — kuukausivalinnan vaikutus', () => {
  test('marraskuu ei sisällä 2870 ALV-velka-tiliä (ALV ei vielä käytössä)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Raportit' }).click();
    await page.locator('#report-month-sel').selectOption('0');
    await expect(page.getByText('2870')).not.toBeVisible();
  });

  test('tammikuu sisältää 2871 suoritettava ALV', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Raportit' }).click();
    await page.locator('#report-month-sel').selectOption('2');
    await expect(page.getByText(/2871/).first()).toBeVisible();
    await expect(page.getByText('✓ Tase tasapainossa')).toBeVisible();
  });

  test('helmikuu sisältää 7680 poistokirjaus', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Raportit' }).click();
    // Default is helmikuu (index 3)
    await expect(page.getByText(/7680/).first()).toBeVisible();
    await expect(page.getByText(/1200/).first()).toBeVisible();
  });

  test('tase tasapainossa kaikilla kuukausivalinnoilla', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Raportit' }).click();
    const sel = page.locator('#report-month-sel');
    for (const idx of ['0', '1', '2', '3', '4']) {
      await sel.selectOption(idx);
      await expect(page.getByText('✓ Tase tasapainossa')).toBeVisible();
    }
  });
});

test.describe('Raportit — sisältö', () => {
  test('liikevaihto-osio näyttää 3000 Myynti palvelumyynti', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Raportit' }).click();
    // "LIIKEVAIHTO" (exact) and "Liikevaihto yhteensä" are both present — use exact match
    await expect(page.getByText('LIIKEVAIHTO', { exact: true })).toBeVisible();
    await expect(page.getByText(/3000/).first()).toBeVisible();
  });

  test('vastaavaa-osio sisältää pankkitilin', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Raportit' }).click();
    // "VASTAAVAA" (exact) and "Vastaavaa yhteensä" are both present — use exact match
    await expect(page.getByText('VASTAAVAA', { exact: true })).toBeVisible();
    await expect(page.getByText(/1910/).first()).toBeVisible();
  });
});
