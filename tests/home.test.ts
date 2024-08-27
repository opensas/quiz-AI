import { expect, test } from '@playwright/test';

test('home page has expected h2', async ({ page }) => {
	await page.goto('/');

	// titulo
	const titulo = page.locator('h2');
	await expect(titulo).toBeVisible();
	await expect(titulo).toContainText(/^Evaluación de la experiencia/);
});

test('previous button is not visible on first question', async ({ page }) => {
	await page.goto('/');

	// titulo
	const question = page.locator('h3');
	await expect(question).toBeVisible();
	await expect(question).toContainText(/^1\./);

	const siguiente = await page.$('button:has-text("Siguiente")');
	expect(siguiente).not.toBeNull();

	const anterior = await page.$('button:has-text("Anterior")');
	expect(anterior).not.toBeNull();

	const isVisible = await anterior!.isVisible();
	expect(isVisible).toBeFalsy();
});
