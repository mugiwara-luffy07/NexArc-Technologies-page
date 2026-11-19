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

test("unknown route shows the full-screen 404 without site chrome", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("This page is off the arc.")).toBeVisible();
  await expect(page.getByRole("banner")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
  await page.getByRole("link", { name: "Go home" }).click();
  await expect(page).toHaveURL(/\/$/);
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

test("theme toggle in the phone menu is tappable and switches theme", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone-only menu sheet");
  await page.goto("/");
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.getByRole("button", { name: "Open menu" }).click();
  // a real click: fails if anything (like the WhatsApp button) covers the toggle
  await page.locator("#mobile-menu").getByRole("button", { name: /switch to (dark|light) theme/i }).click({ timeout: 5000 });
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).not.toBe(before);
});

test("llms.txt and robots.txt describe the site for AI crawlers", async ({ request }) => {
  const llms = await request.get("/llms.txt");
  expect(llms.ok()).toBeTruthy();
  expect(await llms.text()).toContain("Tamil Nadu");
  expect((await request.get("/llms-full.txt")).ok()).toBeTruthy();
  expect(await (await request.get("/robots.txt")).text()).toContain("GPTBot");
});

test("internship application needs a resume and submits with one", async ({ page }) => {
  await page.goto("/internships");
  await page.getByLabel("Full name").fill("Test Applicant");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Phone or WhatsApp").fill("+91 9876543210");
  await page.getByLabel("College, degree and year").fill("B.E. CSE, 3rd year");
  await page.getByLabel("GitHub profile").fill("github.com/test-applicant");
  await page.getByLabel("Tell us about an application you built").fill("A booking app with Next.js and Supabase, with auth and a REST API for slots.");
  await page.getByRole("checkbox").check({ force: true });
  const resume = page.getByLabel(/Resume/);
  await expect(resume).toHaveAttribute("required", "");
  await resume.setInputFiles({ name: "resume.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 test") });
  await page.getByRole("button", { name: "Send application" }).click();
  await expect(page.getByText("Application received.")).toBeVisible();
});

test.describe("hiring dashboard", () => {
  test("is locked behind a password and kept out of search", async ({ page }) => {
    await page.goto("/s3cret");
    await expect(page.getByRole("heading", { name: "Hiring dashboard" })).toBeVisible();
    await expect(page.getByText("Priya Raman")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect((await page.request.get("/s3cret/export")).status()).toBe(401);
    await page.getByLabel("Password").fill("wrong");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Wrong password.")).toBeVisible();
  });

  test("signs in and reports a missing database clearly", async ({ page }) => {
    await page.goto("/s3cret");
    await page.getByLabel("Password").fill("e2e-admin-pass");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("heading", { name: "Database not connected" })).toBeVisible();
    await expect(page.getByRole("switch", { name: "Demo data" })).toHaveCount(0);
  });
});
