import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/** The worked example from the spec, so the results screen has content. */
const answers = {
  changes: 'no', people: '3+', kids: '6-12', pets: 'none', allergy: 'no', home: 'elevator', homeSize: '60-90',
  garden: 'none', neighbors: 'yes', time: '1-2', aloneHours: '4-8', sport: 'walks', travel: 'rare',
  budget: '300-600', experience: 'none', priorities: ['kids', 'trainable'], climate: 'center', hair: 'some',
}
const screens = ['/', '/quiz', '/quiz/refine', '/results', '/library', '/breed/border-collie', '/breed/shih-tzu', '/compare?a=labrador&b=pug', '/owner', '/my-dog', '/my-dog/abc', '/my-dog/old', '/store', '/insurance', '/toxic', '/health', '/places', '/zanbi', '/lost', '/lost?m=found', '/kids', '/adopt', '/sitters', '/emergency', '/accessibility', '/nope']

test.beforeEach(async ({ context }) => {
  await context.addInitScript((a) => {
    localStorage.setItem('dogmatch.answers.v1', JSON.stringify(a))
    localStorage.setItem('dogmatch.projects.v1', JSON.stringify([{ id: 'abc', name: 'לולה', breedId: 'golden', birth: '2026-08-20', created: '2026-11-01', done: {}, duties: [], bag: { kg: 12, opened: '2026-10-20' } }, { id: 'old', name: 'רקס', breedId: 'labrador', birth: '2017-03-01', created: '2026-01-01', done: {}, duties: [] }]))
    sessionStorage.setItem('dogmatch.splash', '1')
  }, answers)
})

for (const theme of ['light', 'night'] as const) {
  for (const path of screens) {
    test(`axe finds no violations on ${path} (${theme})`, async ({ page, context }) => {
      if (theme === 'night') await context.addInitScript(() => localStorage.setItem('dogmatch.night.v1', 'true'))
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
    })
  }
}

test('the quiz works from the keyboard and reaches the results', async ({ page, context }) => {
  await context.addInitScript(() => localStorage.setItem('dogmatch.answers.v1', '{}'))
  await page.goto('/quiz')
  for (let i = 0; i < 18; i++) {
    const heading = await page.getByRole('heading', { level: 1 }).textContent()
    await page.getByRole('group').getByRole('button').first().focus()
    await page.keyboard.press('Enter')
    if (i === 15) await page.getByRole('button', { name: 'המשך' }).press('Enter')
    if (i < 17) await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(heading!)
  }
  await expect(page).toHaveURL(/\/results/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('every result shows at least two things worth knowing', async ({ page }) => {
  await page.goto('/results')
  const cards = page.locator('ol > li')
  await expect(cards.first()).toBeVisible()
  for (const card of await cards.all()) {
    expect(await card.locator('h4', { hasText: 'כדאי שתדע' }).locator('xpath=following-sibling::ul/li').count()).toBeGreaterThanOrEqual(2)
  }
})

test('zanbi answers a food question and links to the list', async ({ page }) => {
  await page.goto('/zanbi')
  await page.getByLabel('שאלה לזנבי').fill('מותר לו לאכול שוקולד?')
  await page.getByRole('button', { name: 'שליחה' }).click()
  await expect(page.getByRole('log')).toContainText('שוקולד: אסור')
  await expect(page.getByRole('link', { name: 'כל רשימת המזונות' })).toBeVisible()
})

test('a senior dog gets the golden age section', async ({ page }) => {
  await page.goto('/my-dog/old')
  await expect(page.getByRole('heading', { name: 'רקס כבר כלב מבוגר' })).toBeVisible()
  await expect(page.getByText('בדיקה תקופתית לכלב מבוגר')).toBeVisible()
})

test('the map filters places by kind', async ({ page }) => {
  await page.goto('/places')
  const items = page.getByRole('list', { name: /מקומות/ }).getByRole('listitem')
  await expect(items).toHaveCount(26)
  await page.getByRole('button', { name: 'חופים', exact: true }).click()
  await expect(items).toHaveCount(3)
})
