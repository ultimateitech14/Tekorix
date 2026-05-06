import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

type BackendEnv = {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
};

const backendEnvPath = path.resolve(__dirname, "..", "..", "..", "backend", ".env");
const backendEnv = parseEnvFile(backendEnvPath);
const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://tekorix-backend.onrender.com";
const adminEmail = process.env.PLAYWRIGHT_ADMIN_EMAIL ?? backendEnv.ADMIN_EMAIL ?? "admin@startupwork.dev";
const adminPassword = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? backendEnv.ADMIN_PASSWORD ?? "Admin@123";
const adminSessionCookieName = "tekorix_admin_session";
const adminTokenStorageKey = "tekorix_admin_token";

const publicRoutes = [
  "/",
  "/services",
  "/hr-consulting",
  "/business-consulting",
  "/academy",
  "/about",
  "/contact",
  "/find-job",
  "/find-talent",
  "/careers",
  "/blog",
] as const;

const adminRoutes = [
  "/admin",
  "/admin/jobs",
  "/admin/jobs/new",
  "/admin/applications",
  "/admin/blog",
  "/admin/candidates",
  "/admin/leads/company",
  "/admin/leads/candidate",
  "/admin/email-templates",
  "/admin/notifications",
  "/admin/logs",
  "/admin/settings",
  "/admin/settings?tab=careers",
  "/admin/settings?tab=talent-profiles",
  "/admin/settings/security",
  "/admin/profile",
  "/admin/users",
  "/admin/roles",
] as const;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ request }) => {
  await ensureAdminPassword(request);
});

test("public navigation works across responsive viewports", async ({ page }) => {
  await page.goto("/");
  await assertVisibleMainHeading(page);
  await assertNoHorizontalOverflow(page);

  await clickPublicNavigation(page, "Services", "/business-consulting");
  await expect(page).toHaveURL(/\/business-consulting$/);
  await assertVisibleMainHeading(page);
  await assertNoHorizontalOverflow(page);

  await clickPublicNavigation(page, "Academy", "/academy/certification");
  await expect(page).toHaveURL(/\/academy\/certification$/);
  await assertVisibleMainHeading(page);
  await assertNoHorizontalOverflow(page);

  await clickPublicNavigation(page, "Contact Us");
  await expect(page).toHaveURL(/\/contact$/);
  await assertVisibleMainHeading(page);
  await assertNoHorizontalOverflow(page);

  await page.goto("/");
  const careersFooterLink = page.locator("footer").getByRole("link", { name: /^Careers$/ });
  await careersFooterLink.scrollIntoViewIfNeeded();
  await careersFooterLink.click();
  await expect(page).toHaveURL(/\/careers$/);
  await assertVisibleMainHeading(page);
  await assertNoHorizontalOverflow(page);
});

test("public routes render without horizontal overflow", async ({ page }) => {
  for (const route of publicRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await assertVisibleMainHeading(page);
    await assertNoHorizontalOverflow(page);
  }
});

test("admin login and sidebar navigation work across responsive viewports", async ({ page, request }) => {
  await loginAsAdmin(page, request);
  await assertNoHorizontalOverflow(page);

  await clickAdminSidebarChild(page, "Jobs", "All Jobs");
  await assertAdminHeading(page, "Jobs");
  await assertNoHorizontalOverflow(page);

  await clickAdminSidebarChild(page, "Blog", "All Posts");
  await assertAdminHeading(page, "Blog");
  await assertNoHorizontalOverflow(page);

  await clickAdminSidebarChild(page, "Email & Notifications", "Notification Logs");
  await expect(page).toHaveURL(/\/admin\/logs\?tab=notifications$/);
  await assertAdminHeading(page, "Logs");
  await assertNoHorizontalOverflow(page);

  await clickAdminSidebarChild(page, "Settings", "Company Profile");
  await expect(page).toHaveURL(/\/admin\/settings$/);
  await assertAdminHeading(page, "Settings");
  await assertNoHorizontalOverflow(page);

  await clickAdminSidebarChild(page, "System", "Users");
  await expect(page).toHaveURL(/\/admin\/users$/);
  await assertAdminHeading(page, "Users");
  await assertNoHorizontalOverflow(page);
});

test("admin routes load correctly across responsive viewports", async ({ page, request }) => {
  await loginAsAdmin(page, request);

  for (const route of adminRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await assertAdminShellLoaded(page);
    await assertNoHorizontalOverflow(page);
  }
});

function parseEnvFile(filePath: string): BackendEnv {
  const content = readFileSync(filePath, "utf8");
  const parsed: BackendEnv = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    parsed[key as keyof BackendEnv] = value;
  }

  return parsed;
}

async function ensureAdminPassword(request: APIRequestContext) {
  const loginResponse = await request.post(`${backendBaseUrl}/api/auth/admin/login`, {
    data: {
      email: adminEmail,
      password: adminPassword,
    },
  });

  if (loginResponse.ok()) {
    return;
  }

  const forgotResponse = await request.post(`${backendBaseUrl}/api/auth/admin/forgot-password`, {
    data: {
      email: adminEmail,
    },
  });

  expect(forgotResponse.ok()).toBeTruthy();
  const forgotPayload = (await forgotResponse.json()) as {
    data?: {
      resetUrl?: string;
    };
  };
  const resetUrl = forgotPayload.data?.resetUrl;
  expect(resetUrl).toBeTruthy();

  const token = new URL(resetUrl!).searchParams.get("token");
  expect(token).toBeTruthy();

  const resetResponse = await request.post(`${backendBaseUrl}/api/auth/admin/reset-password`, {
    data: {
      token,
      password: adminPassword,
      confirmPassword: adminPassword,
    },
  });

  expect(resetResponse.ok()).toBeTruthy();
}

async function loginAsAdmin(page: Page, request: APIRequestContext) {
  await ensureAdminPassword(request);
  await page.goto("/login");

  if (page.url().endsWith("/admin")) {
    await assertAdminAuthStateReady(page);
    await assertAdminHeading(page, "Dashboard");
    return;
  }

  await page.getByLabel("Email").fill(adminEmail);
  await page.getByLabel("Password").fill(adminPassword);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/admin$/);
  await assertAdminAuthStateReady(page);
  await assertAdminHeading(page, "Dashboard");
}

async function clickPublicNavigation(page: Page, topLevelLabel: string, childHref?: string) {
  const header = page.locator("header").first();

  if (isDesktopViewport(page)) {
    if (childHref) {
      await header.getByRole("button", { name: new RegExp(`^${escapeRegExp(topLevelLabel)}$`, "i") }).click();
      await page.locator(`a[href="${childHref}"]`).last().click();
      return;
    }

    await header.getByRole("link", { name: new RegExp(`^${escapeRegExp(topLevelLabel)}$`, "i") }).click();
    return;
  }

  await openPublicMenu(page);

  if (childHref) {
    await header.getByRole("button", { name: new RegExp(`^${escapeRegExp(topLevelLabel)}$`, "i") }).click();
    await header.locator(`a[href="${childHref}"]`).first().click();
    return;
  }

  await header.getByRole("link", { name: new RegExp(`^${escapeRegExp(topLevelLabel)}$`, "i") }).click();
}

async function openPublicMenu(page: Page) {
  const toggle = page.getByRole("button", { name: /open navigation/i });

  if (await toggle.isVisible()) {
    await toggle.click();
  }
}

async function clickAdminSidebarChild(page: Page, sectionLabel: string, childLabel: string) {
  await openAdminSidebarIfNeeded(page);

  await page.getByRole("button", { name: new RegExp(`^${escapeRegExp(sectionLabel)}$`, "i") }).click();
  await page.getByRole("link", { name: new RegExp(`^${escapeRegExp(childLabel)}$`, "i") }).click();
}

async function openAdminSidebarIfNeeded(page: Page) {
  const toggle = page.getByRole("button", { name: /open navigation/i });

  if (await toggle.isVisible()) {
    await toggle.click();
  }
}

async function assertVisibleMainHeading(page: Page) {
  await expect(page.getByRole("heading").first()).toBeVisible();
}

async function assertAdminHeading(page: Page, title: string) {
  await expect(page.getByRole("heading", { name: new RegExp(`^${escapeRegExp(title)}$`, "i") }).first()).toBeVisible();
}

async function assertAdminShellLoaded(page: Page) {
  await expect
    .poll(() => {
      const pathname = new URL(page.url()).pathname;
      return pathname.startsWith("/admin") ? "admin" : pathname;
    })
    .toBe("admin");

  await expect(page.locator("header").first().getByRole("heading").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in/i })).toHaveCount(0);
}

async function assertAdminAuthStateReady(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        ({ cookieName, storageKey }) => ({
          hasCookie: document.cookie.includes(`${cookieName}=`),
          hasToken: Boolean(window.localStorage.getItem(storageKey)),
        }),
        {
          cookieName: adminSessionCookieName,
          storageKey: adminTokenStorageKey,
        },
      ),
    )
    .toEqual({
      hasCookie: true,
      hasToken: true,
    });
}

async function assertNoHorizontalOverflow(page: Page) {
  await expect
    .poll(async () => {
      return page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - window.innerWidth;
      });
    })
    .toBeLessThanOrEqual(2);
}

function isDesktopViewport(page: Page) {
  const width = page.viewportSize()?.width ?? 1280;
  return width >= 1024;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
