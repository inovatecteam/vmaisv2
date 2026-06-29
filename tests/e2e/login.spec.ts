import { test, expect } from '@playwright/test'

const EMAIL = process.env.TEST_EMAIL!
const PASSWORD = process.env.TEST_PASSWORD!

test.beforeAll(() => {
  if (!EMAIL || !PASSWORD) {
    throw new Error('Set TEST_EMAIL and TEST_PASSWORD env vars before running this test')
  }
})

async function login(page: import('@playwright/test').Page) {
  await page.goto('/entrar')
  await page.locator('#email').fill(EMAIL)
  await page.locator('#password').fill(PASSWORD)
  await page.locator('form button[type="submit"]').click()
}

test('valid login leaves /entrar and lands on an authenticated route', async ({ page }) => {
  await login(page)

  await expect(page).not.toHaveURL(/\/entrar/, { timeout: 20_000 })
  await expect(page).toHaveURL(/\/(onboarding|perfil|dashboard)/, { timeout: 20_000 })

  const cookies = await page.context().cookies()
  expect(
    cookies.some((c) => c.name.includes('auth-token')),
    'expected a Supabase auth-token cookie after login'
  ).toBe(true)
})

test('after login the visible UI reflects the logged-in state (the reported bug)', async ({ page }) => {
  await login(page)
  await expect(page).not.toHaveURL(/\/entrar/, { timeout: 20_000 })

  // Regression guard for "a tela recarrega e nada acontece": the destination
  // must NOT render the logged-out UI...
  await expect(page.getByText('Faça login para acessar seu perfil')).toHaveCount(0, {
    timeout: 20_000,
  })
  await expect(page.getByRole('button', { name: 'Cadastrar' })).toHaveCount(0, { timeout: 20_000 })

  // ...and the navbar must positively show the logged-in account (user name).
  await expect(page.getByText('Claude Test').first()).toBeVisible({ timeout: 20_000 })
})

test('reload after login keeps the user authenticated', async ({ page }) => {
  await login(page)
  await expect(page).not.toHaveURL(/\/entrar/, { timeout: 20_000 })

  await page.reload()
  await expect(page).not.toHaveURL(/\/entrar/, { timeout: 20_000 })
  await expect(page.getByText('Faça login para acessar seu perfil')).toHaveCount(0, {
    timeout: 20_000,
  })
})

test('invalid credentials show an error and keep the user on /entrar', async ({ page }) => {
  await page.goto('/entrar')
  await page.locator('#email').fill(EMAIL)
  await page.locator('#password').fill('senha-errada-de-proposito')
  await page.locator('form button[type="submit"]').click()

  await expect(page.getByText('Email ou senha incorretos.')).toBeVisible({ timeout: 20_000 })
  await expect(page).toHaveURL(/\/entrar/)
})

test('logout returns the app to the logged-out state', async ({ page }) => {
  await login(page)
  await expect(page).not.toHaveURL(/\/entrar/, { timeout: 20_000 })
  await expect(page.getByText('Claude Test').first()).toBeVisible({ timeout: 20_000 })

  // Open the account dropdown and sign out.
  await page.getByText('Claude Test').first().click()
  await page.getByRole('menuitem', { name: 'Sair' }).click()

  await expect(page.getByRole('button', { name: 'Cadastrar' }).first()).toBeVisible({
    timeout: 20_000,
  })
})
