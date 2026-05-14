import { test, expect } from '@playwright/test';

// Teacher panel MVP — tab visibility + level selector

test.describe('Opettajan paneeli — avaus ja sulkeminen', () => {
  test('Opettaja-nappi näkyy headerissa', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Opettaja' })).toBeVisible();
  });

  test('Opettaja-nappi avaa paneelin', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();
    await expect(page.getByRole('dialog', { name: /Opettajan asetukset/i })).toBeVisible();
    await expect(page.getByText('Opettajan asetukset')).toBeVisible();
  });

  test('paneelin Sulje-nappi sulkee paneelin', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();
    await page.getByRole('button', { name: /Sulje paneeli/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Escape-näppäin sulkee paneelin', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('taustan klikkaaminen sulkee paneelin', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();
    // Click the backdrop (positioned at left edge of screen, away from panel)
    await page.mouse.click(50, 300);
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});

test.describe('Opettajan paneeli — välilehtien hallinta', () => {
  test('paneeli listaa kaikki 6 välilehteä', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();
    // All tabs should have checkboxes
    const checkboxes = page.locator('.tp-checkbox');
    await expect(checkboxes).toHaveCount(6);
  });

  test('välilehden piilottaminen poistaa sen tab-palkista', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();

    // Find the Helmikuu checkbox and uncheck it
    const helmikuuRow = page.locator('.tp-tab-row', { hasText: 'Helmikuu' });
    await helmikuuRow.locator('.tp-checkbox').uncheck();

    // Close panel
    await page.keyboard.press('Escape');

    // Helmikuu tab should no longer be in the tab bar
    await expect(page.getByRole('button', { name: /Helmikuu/i })).not.toBeVisible();
  });

  test('piilotetun välilehden voi palauttaa näkyviin', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();

    // Hide Joulukuu
    const joulukuuRow = page.locator('.tp-tab-row', { hasText: 'Joulukuu' });
    await joulukuuRow.locator('.tp-checkbox').uncheck();

    // Re-enable it
    await joulukuuRow.locator('.tp-checkbox').check();
    await page.keyboard.press('Escape');

    await expect(page.getByRole('button', { name: /Joulukuu/i })).toBeVisible();
  });

  test('viimeistä näkyvää välilehteä ei voi piilottaa', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();

    // Hide all tabs except one (Sanasto)
    const tabNames = ['Marraskuu', 'Joulukuu', 'Tammikuu', 'Helmikuu', 'Raportit'];
    for (const name of tabNames) {
      const row = page.locator('.tp-tab-row', { hasText: name });
      await row.locator('.tp-checkbox').uncheck();
    }

    // Try to uncheck the last one (Sanasto) — guard should keep it checked.
    // Use .click() not .uncheck() — uncheck() throws if state doesn't change.
    const sanastoRow = page.locator('.tp-tab-row', { hasText: 'Sanasto' });
    await sanastoRow.locator('.tp-checkbox').click();
    await expect(sanastoRow.locator('.tp-checkbox')).toBeChecked();
  });
});

test.describe('Opettajan paneeli — tasonvalitsin', () => {
  test('tasonvalitsin näyttää 4 tasoa', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();
    const levelBtns = page.locator('.tp-level-btn');
    await expect(levelBtns).toHaveCount(4);
  });

  test('taso 1 on oletuksena aktiivinen', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();
    const level1 = page.locator('.tp-level-btn').first();
    await expect(level1).toHaveClass(/tp-level-active/);
  });

  test('tason valinta päivittää kuvauksen', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Opettaja' }).click();
    await page.locator('.tp-level-btn').nth(1).click(); // Taso 2
    await expect(page.getByText(/ALV.*käyttöomaisuus/i)).toBeVisible();
  });
});
