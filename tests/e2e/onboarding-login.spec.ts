import { test, expect } from '@playwright/test'

// A brand-new (not-yet-onboarded) account. After login it must land on
// /onboarding and actually render the onboarding form — NOT get stuck on the
// "Carregando..." spinner forever (which happened when the browser Supabase
// client's getUser() hung and AuthProvider never populated `user`).
const EMAIL = process.env.TEST_NEW_EMAIL!
const PASSWORD = process.env.TEST_NEW_PASSWORD!

test.beforeAll(() => {
  if (!EMAIL || !PASSWORD) {
    throw new Error('Set TEST_NEW_EMAIL and TEST_NEW_PASSWORD env vars')
  }
})

test('a fresh user logs in and reaches the onboarding form (no infinite spinner)', async ({
  page,
}) => {
  await page.goto('/entrar')
  await page.locator('#email').fill(EMAIL)
  await page.locator('#password').fill(PASSWORD)
  await page.locator('form button[type="submit"]').click()

  await expect(page).toHaveURL(/\/onboarding/, { timeout: 20_000 })

  // The onboarding form must render (proves AuthProvider resolved the session).
  await expect(page.getByText('Vamos configurar seu perfil', { exact: false })).toBeVisible({
    timeout: 20_000,
  })
  // And we must NOT be stuck on the loading spinner.
  await expect(page.getByText('Carregando...')).toHaveCount(0, { timeout: 20_000 })
})
