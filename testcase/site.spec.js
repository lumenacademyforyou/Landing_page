import { expect, test } from "@playwright/test";

const pages = [
  { path: "/index.html", heading: /smarter institutional management|future of institutional governance/i },
  { path: "/about.html", heading: /writing the future history of educational technology/i },
  { path: "/features.html", heading: /engineered for institutional scale/i },
  { path: "/pricing.html", heading: /predictable institutional subscriptions/i },
  { path: "/services.html", heading: /enterprise onboarding/i },
  { path: "/why.html", heading: /why/i },
  { path: "/organization.html", heading: /organization|leadership/i },
  { path: "/architecture.html", heading: /technical architecture|security framework/i },
  { path: "/404.html", heading: /^404$/ }
];

test.describe("Scored static website", () => {
  for (const sitePage of pages) {
    test(`${sitePage.path} loads with a visible page heading`, async ({ page }) => {
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));

      const response = await page.goto(sitePage.path);

      expect(response?.ok(), `${sitePage.path} should return a successful response`).toBeTruthy();
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator("main h1")).toContainText(sitePage.heading);
      expect(pageErrors).toEqual([]);
    });
  }

  test("home CTAs lead to the live evaluations showcase", async ({ page }) => {
    await page.goto("/index.html");

    const simulationLink = page.getByRole("link", { name: "Explore Live Simulation" }).first();
    await expect(simulationLink).toHaveAttribute("href", "#evaluations-showcase");
    await simulationLink.click();

    await expect(page).toHaveURL(/#evaluations-showcase$/);
    await expect(page.locator("#evaluations-showcase")).toBeVisible();
  });

  test("404 page exposes an accessible mobile navigation menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/404.html");

    const menuButton = page.getByRole("button", { name: "Open menu" });
    const mobileMenu = page.locator("#mobile-menu");

    await expect(menuButton).toBeVisible();
    await expect(mobileMenu).toBeHidden();
    await menuButton.click();

    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(mobileMenu).toBeVisible();
    await expect(mobileMenu.getByRole("button", { name: "Features" }).or(mobileMenu.getByRole("link", { name: "Features" }))).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(mobileMenu).toBeHidden();
  });

  test("organization CTA keeps its copy legible against the blue background", async ({ page }) => {
    await page.goto("/organization.html");

    const cta = page.locator(".org-bottom-cta");
    const title = page.locator(".org-bottom-cta-title");
    const description = page.locator(".org-bottom-cta-copy");

    await expect(cta).toBeVisible();
    await expect(title).toBeVisible();
    await expect(description).toBeVisible();
    await expect(title).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(description).toHaveCSS("color", "rgb(255, 255, 255)");
  });

  test("internal links and fragments on the home page resolve", async ({ page, request }) => {
    await page.goto("/index.html");

    const hrefs = await page.locator('a[href]').evaluateAll((links) =>
      [...new Set(links.map((link) => link.getAttribute("href")))]
    );

    for (const href of hrefs) {
      if (!href || /^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(href)) continue;

      const [pathname, fragment] = href.split("#");
      const targetPath = pathname || "/index.html";
      const response = await request.get(targetPath);
      expect(response.ok(), `${href} should resolve`).toBeTruthy();

      if (fragment) {
        const targetHtml = await response.text();
        const idPattern = new RegExp(`(?:id|name)=["']${fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i");
        expect(targetHtml, `${href} should target an existing element`).toMatch(idPattern);
      }
    }
  });

  test("header Log In button opens institutional login modal dialog", async ({ page }) => {
    await page.goto("/index.html");

    const loginBtn = page.getByRole("button", { name: "Log In" }).first();
    await expect(loginBtn).toBeVisible();
    await loginBtn.click();

    const dialog = page.locator("#institutional-login-modal");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Institutional Login" })).toBeVisible();

    // Close with Escape or close button
    const closeBtn = dialog.locator(".login-modal-close");
    await closeBtn.click();
    await expect(dialog).toBeHidden();
  });

  test("home page contains verified trust metrics row", async ({ page }) => {
    await page.goto("/index.html");

    const trustBar = page.locator(".hero-trust-bar");
    await expect(trustBar).toBeVisible();
    await expect(trustBar).toContainText("50+ Integrated Modules");
    await expect(trustBar).toContainText("100% Secure CBT Engine");
    await expect(trustBar).toContainText("Academic & Admin Roles");
    await expect(trustBar).toContainText("100+ Board Compliant");
  });

  test("why.html has all-caps heading for student lifecycle", async ({ page }) => {
    await page.goto("/why.html");

    const heading = page.locator("#life-title");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("FROM ADMISSION TO REPORT CARD, ONE STUDENT RECORD");
  });
});
