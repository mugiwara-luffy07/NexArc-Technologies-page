import { expect, test } from "@playwright/test";

const routes = ["/", "/services", "/services/websites", "/work", "/work/sss-catering-crm", "/products", "/products/arc-events", "/about", "/internships", "/contact", "/privacy", "/terms"];

for (const route of routes) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);

    const { scrollWidth, clientWidth, text } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      text: document.body.innerText,
    }));
    expect(scrollWidth, "no horizontal scroll").toBeLessThanOrEqual(clientWidth);
    expect(text, "no em or en dashes in copy").not.toMatch(/[–—]/);
    expect(errors).toEqual([]);
  });
}

test("unknown route shows the branded 404", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /off the arc/i })).toBeVisible();
});

test("primary navigation works", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile || (page.viewportSize()?.width ?? 0) < 1024) {
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await toggle.click();
    await menu.getByRole("link", { name: "Work" }).click();
  } else {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" }).click();
  }
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Work");
});

test("start a project CTA is visible in the header at every size", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("banner").getByRole("link", { name: "Start a project" })).toBeVisible();
});

test("project brief: validates each step and submits", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Pick the closest option")).toBeVisible();

  await page.getByText("CRM / business software", { exact: true }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByText("₹1.5L to ₹5L", { exact: true }).click();
  await page.getByText("Within 1 to 2 months", { exact: true }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByLabel("Tell us about the project").fill("We run a catering business and need bookings and payments in one place.");
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByLabel("Your name").fill("Meena Raghavan");
  await page.getByLabel("Email").fill("meena@example.com");
  await page.getByLabel("Phone or WhatsApp").fill("+91 98430 12345");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send brief" }).click();
  await expect(page.getByRole("heading", { name: /brief received/i })).toBeVisible();
});

test("service page pre-selects the service in the brief", async ({ page }) => {
  await page.goto("/services/crm");
  await page.getByRole("main").getByRole("link", { name: "Start a project" }).first().click();
  await expect(page).toHaveURL(/service=/);
  await expect(page.getByRole("radio", { name: "CRM / business software" })).toBeChecked();
});

test("waitlist signup", async ({ page }) => {
  await page.goto("/products#waitlist");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Join the waitlist" }).click();
  await expect(page.getByText(/you are on the list/i)).toBeVisible();
});

test("theme toggle switches to dark and persists", async ({ page, isMobile }) => {
  test.skip(isMobile, "toggle lives in the menu sheet on phones");
  await page.goto("/");
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.getByRole("banner").getByRole("button", { name: /switch to (dark|light) theme/i }).click();
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(after).not.toBe(before);
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(after);
});
