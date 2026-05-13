import { test, expect } from '@playwright/test';

// Full voucher flow: yksityissijoitus — all 7 lifecycle steps in all 3 themes

test.describe('Yksityissijoitus — täysi tositepolku', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to Tositekirjaus tab
    await page.getByRole('button', { name: 'Tositekirjaus — Marraskuu' }).click();
    // MonthIntro must appear
    await expect(page.getByRole('heading', { name: /Marraskuu 2026/ })).toBeVisible();
    // Start exercises
    await page.getByRole('button', { name: /Aloita marraskuun kirjaukset/i }).click();
  });

  test('näyttää yksityissijoituksen tositekortin', async ({ page }) => {
    await expect(page.getByText('Yksityissijoitus')).toBeVisible();
    await expect(page.getByText('5 000,00 €')).toBeVisible();
    await expect(page.getByText(/Nide Bank/i)).toBeVisible();
  });

  test('siirtyy tiliristikkoon', async ({ page }) => {
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();
    await expect(page.getByText('Vaihe 1 / 2')).toBeVisible();
    await expect(page.getByText('Kirjaa tiliristikkoon')).toBeVisible();
  });

  test('tiliristikko: väärä tasapaino antaa balance-virheen', async ({ page }) => {
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();

    // Add only one entry (debet 5000) — unbalanced
    await page.getByLabel('Tili').selectOption('1910');
    await page.getByLabel('Summa').fill('5000');
    await page.getByRole('button', { name: 'Lisää kirjaus' }).click();

    await page.getByRole('button', { name: 'Tarkista' }).click();
    await expect(page.getByText(/balance/i)).toBeVisible();
    await expect(page.getByText(/tasapainossa/i)).toBeVisible();
  });

  test('tiliristikko: oikea vastaus hyväksytään', async ({ page }) => {
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();

    // Add 1910 debet 5000
    await page.getByLabel('Tili').selectOption('1910');
    const radioDebet = page.getByLabel('Debet');
    await radioDebet.check();
    await page.getByLabel('Summa').fill('5000');
    await page.getByRole('button', { name: 'Lisää kirjaus' }).click();

    // Add 2080 kredit 5000
    await page.getByLabel('Tili').selectOption('2080');
    await page.getByLabel('Kredit').check();
    await page.getByLabel('Summa').fill('5000');
    await page.getByRole('button', { name: 'Lisää kirjaus' }).click();

    await page.getByRole('button', { name: 'Tarkista' }).click();
    await expect(page.getByText('✓ Tiliristikko oikein!')).toBeVisible();
  });

  test('muistiotosite-vaihe aukeaa tiliristikon jälkeen', async ({ page }) => {
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();
    await addCorrectLedgerEntries(page);
    await page.getByRole('button', { name: 'Tarkista' }).click();
    await page.getByRole('button', { name: /Jatka muistiotosite/i }).click();

    await expect(page.getByText('Vaihe 2 / 2')).toBeVisible();
    await expect(page.getByText('Kirjaa muistiotosite')).toBeVisible();
  });

  test('muistiotosite: oikea vastaus hyväksytään', async ({ page }) => {
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();
    await addCorrectLedgerEntries(page);
    await page.getByRole('button', { name: 'Tarkista' }).click();
    await page.getByRole('button', { name: /Jatka muistiotosite/i }).click();

    // Default theme = nide → Procountor form (separate debet/kredit columns)
    await page.getByRole('button', { name: /Lisää rivi/i }).click();
    const rows = page.locator('.jef-row');
    await rows.first().getByRole('combobox', { name: /tili/i }).selectOption('1910');
    await rows.first().getByRole('textbox', { name: /rivi 1: debet/i }).fill('5000');

    await page.getByRole('button', { name: /Lisää rivi/i }).click();
    const rows2 = page.locator('.jef-row');
    await rows2.nth(1).getByRole('combobox', { name: /tili/i }).selectOption('2080');
    await rows2.nth(1).getByRole('textbox', { name: /rivi 2: kredit/i }).fill('5000');

    await page.getByRole('button', { name: 'Tarkista' }).click();
    await expect(page.getByText('✓ Muistiotosite oikein!')).toBeVisible();
  });

  test('selitys näytetään ja tosite merkitään valmiiksi', async ({ page }) => {
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();
    await addCorrectLedgerEntries(page);
    await page.getByRole('button', { name: 'Tarkista' }).click();
    await page.getByRole('button', { name: /Jatka muistiotosite/i }).click();
    await addCorrectJournalEntries(page);
    await page.getByRole('button', { name: 'Tarkista' }).click();
    await page.getByRole('button', { name: /Lue selitys/i }).click();

    await expect(page.getByText('Valmis', { exact: true })).toBeVisible();
    // Progress tracker should mark first item as valmis after completing
    await page.getByRole('button', { name: /Seuraava tosite/i }).click();
    await expect(page.locator('.pt-item-valmis').first()).toBeVisible();
  });
});

test.describe('Teeman vaihto muistiotositteessa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Marraskuu' }).click();
    await page.getByRole('button', { name: /Aloita marraskuun kirjaukset/i }).click();
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();
    await addCorrectLedgerEntries(page);
    await page.getByRole('button', { name: 'Tarkista' }).click();
    await page.getByRole('button', { name: /Jatka muistiotosite/i }).click();
  });

  test('Netvisor-teema näyttää yksi summa-sarake ilman D/K-pudotusvalikkoa', async ({ page }) => {
    await page.getByRole('button', { name: 'Netvisor' }).click();
    await expect(page.locator('.jef-netvisor')).toBeVisible();
    // One amount column with hint, no D/K dropdown
    await expect(page.getByText('+ debet / − kredit', { exact: false })).toBeVisible();
    await expect(page.locator('.jef-nv-form-header')).toBeVisible();
  });

  test('Procountor-teema näyttää erilliset Debet/Kredit-sarakkeet', async ({ page }) => {
    await page.getByRole('button', { name: 'Procountor' }).click();
    await expect(page.locator('.jef-procountor')).toBeVisible();
    // Procountor has separate Debet and Kredit column headers
    const headers = page.locator('.jef-th');
    await expect(headers.filter({ hasText: 'Debet' })).toBeVisible();
    await expect(headers.filter({ hasText: 'Kredit' })).toBeVisible();
  });
});

test.describe('Saavutettavuus', () => {
  test('tiliristikko toimii näppäimistöllä', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Marraskuu' }).click();
    await page.getByRole('button', { name: /Aloita marraskuun kirjaukset/i }).click();
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();

    // Tab to account select and choose with keyboard
    await page.getByLabel('Tili').focus();
    await page.keyboard.press('Tab'); // to side fieldset
    // Summa field
    const amountInput = page.getByLabel('Summa');
    await amountInput.fill('5000');
    // Enter submits
    await amountInput.press('Enter');
    // Should show validation error (no account selected) but not crash
    await expect(page.getByText('Valitse tili.')).toBeVisible();
  });

  test('MicroContent-popup sulkeutuu Esc-näppäimellä', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Marraskuu' }).click();
    await page.getByRole('button', { name: /Aloita marraskuun kirjaukset/i }).click();
    await page.getByRole('button', { name: /Siirry kirjaukseen/i }).click();

    // Trigger 3 wrong attempts to open MicroContent
    for (let i = 0; i < 3; i++) {
      // Add wrong entry: 1700 debet 5000
      await page.getByLabel('Tili').selectOption('1700');
      await page.getByLabel('Summa').fill('5000');
      await page.getByRole('button', { name: 'Lisää kirjaus' }).click();
      // Add 1910 kredit 5000 to balance
      await page.getByLabel('Tili').selectOption('1910');
      await page.getByLabel('Kredit').check();
      await page.getByLabel('Summa').fill('5000');
      await page.getByRole('button', { name: 'Lisää kirjaus' }).click();
      await page.getByRole('button', { name: 'Tarkista' }).click();
      if (i < 2) {
        // Remove entries for next attempt
        const removes = page.locator('.t-remove');
        const count = await removes.count();
        for (let j = 0; j < count; j++) {
          await removes.first().click();
        }
      }
    }

    // MicroContent should be visible
    await expect(page.getByRole('dialog')).toBeVisible();

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('edistymistrakker on näppäimistöllä navigoitava', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tositekirjaus — Marraskuu' }).click();
    await page.getByRole('button', { name: /Aloita marraskuun kirjaukset/i }).click();

    // ProgressTracker nav has role=navigation
    const nav = page.getByRole('navigation', { name: /Tositteen edistyminen/i });
    await expect(nav).toBeVisible();

    // First item is focusable
    const firstItem = nav.getByRole('button').first();
    await firstItem.focus();
    await expect(firstItem).toBeFocused();
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function addCorrectLedgerEntries(page: import('@playwright/test').Page) {
  await page.getByLabel('Tili').selectOption('1910');
  await page.getByLabel('Debet').check();
  await page.getByLabel('Summa').fill('5000');
  await page.getByRole('button', { name: 'Lisää kirjaus' }).click();

  await page.getByLabel('Tili').selectOption('2080');
  await page.getByLabel('Kredit').check();
  await page.getByLabel('Summa').fill('5000');
  await page.getByRole('button', { name: 'Lisää kirjaus' }).click();
}

async function addCorrectJournalEntries(page: import('@playwright/test').Page) {
  // Default theme = nide → Procountor form (separate debet/kredit columns)
  await page.getByRole('button', { name: /Lisää rivi/i }).click();
  const rows = page.locator('.jef-row');
  await rows.first().getByRole('combobox', { name: /tili/i }).selectOption('1910');
  await rows.first().getByRole('textbox', { name: /rivi 1: debet/i }).fill('5000');

  await page.getByRole('button', { name: /Lisää rivi/i }).click();
  const rows2 = page.locator('.jef-row');
  await rows2.nth(1).getByRole('combobox', { name: /tili/i }).selectOption('2080');
  await rows2.nth(1).getByRole('textbox', { name: /rivi 2: kredit/i }).fill('5000');
}
