import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/** The worked example from the spec, so the results screen has content. */
const answers = {
  changes: 'no', people: '3+', kids: '6-12', pets: 'none', allergy: 'no', home: 'elevator', homeSize: '60-90',
  garden: 'none', neighbors: 'yes', time: '1-2', aloneHours: '4-8', sport: 'walks', travel: 'rare',
  budget: '300-600', experience: 'none', priorities: ['kids', 'trainable'], climate: 'center', hair: 'some',
}
const screens = ['/', '/quiz', '/quiz/refine', '/results', '/library', '/breed/border-collie', '/breed/shih-tzu', '/compare?a=labrador&b=pug', '/owner', '/my-dog', '/my-dog/abc', '/store', '/insurance', '/toxic', '/health', '/emergency', '/accessibility', '/nope']

test.beforeEach(async ({ context }) => {
  await context.addInitScript((a) => {
    localStorage.setItem('dogmatch.answers.v1', JSON.stringify(a))
    localStorage.setItem('dogmatch.projects.v1', JSON.stringify([{ id: 'abc', name: 'לולה', breedId: 'golden', birth: '2026-08-20', created: '2026-11-01', done: {}, duties: [], bag: { kg: 12, opened: '2026-10-20' } }]))
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
