import { expect, test } from "@playwright/test";
import { DOCTOR, MULTI_FACILITY_DOCTOR, signIn } from "./helpers";

test("signed-out visitors are sent to the login page and back after signing in", async ({
  page,
}) => {
  await page.goto("/en/patients");
  await expect(page).toHaveURL(/\/en\/login\?next=%2Fpatients$/);
  await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();

  await page.getByLabel("Email address").fill(DOCTOR.email);
  await page.getByLabel("Password", { exact: true }).fill("ChangeMe!Dev2026");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/en\/patients$/);
  const accountMenu = page.getByRole("button", { name: "Account menu" });
  await expect(accountMenu).toContainText(DOCTOR.name);
  await expect(accountMenu).toContainText("Doctor");
});

test("shows validation and credential errors", async ({ page }) => {
  await page.goto("/en/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Enter your password.")).toBeVisible();

  await page.getByLabel("Email address").fill("nobody@rwhms.gov.rw");
  await page.getByLabel("Password", { exact: true }).fill("Wrong!Password1");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Invalid email or password." }),
  ).toBeVisible();
});

test("the password visibility toggle reveals the password", async ({ page }) => {
  await page.goto("/en/login");
  const password = page.getByLabel("Password", { exact: true });
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
});

test("the session survives a reload, and logout ends it", async ({ page }) => {
  await signIn(page);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();

  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/en\/login$/);

  await page.goto("/en/dashboard");
  await expect(page).toHaveURL(/\/en\/login\?next=%2Fdashboard$/);
});

test("the sidebar logout button signs out", async ({ page }) => {
  await signIn(page);
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/en\/login$/);
});

test("users with several facilities can switch between them", async ({ page }) => {
  await signIn(page, MULTI_FACILITY_DOCTOR);
  const switcher = page.getByRole("button", { name: "Switch facility" });
  const before = (await switcher.textContent()) ?? "";

  await switcher.click();
  const options = page.getByRole("menuitemradio");
  await expect(options).toHaveCount(2);
  await options.filter({ hasNotText: before.trim() }).click();
  await expect(switcher).not.toHaveText(before);
});

test("forgot password confirms without revealing whether the account exists", async ({ page }) => {
  await page.goto("/en/login");
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page).toHaveURL(/\/en\/forgot-password$/);

  await page.getByLabel("Professional email or license ID").fill("nobody@rwhms.gov.rw");
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();

  await page.getByRole("button", { name: "Resend link" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "We sent the link again." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Return to login" }).click();
  await expect(page).toHaveURL(/\/en\/login$/);
});

test("reset password checks the policy and rejects a bad link", async ({ page }) => {
  await page.goto("/en/reset-password");
  await expect(page.getByText("This reset link is incomplete.")).toBeVisible();

  await page.goto("/en/reset-password?token=not-a-real-token-but-long-enough");
  const rules = page.locator("#password-rules li");
  await expect(rules.filter({ has: page.locator('[data-met="true"]') })).toHaveCount(0);

  await page.getByLabel("New password", { exact: true }).fill("Valid!Password2026");
  await expect(page.locator('#password-rules li[data-met="true"]')).toHaveCount(4);
  await page.getByLabel("Confirm new password").fill("Different!2026xx");
  await page.getByRole("button", { name: "Reset password" }).click();
  await expect(page.getByText("The passwords do not match.")).toBeVisible();

  await page.getByLabel("Confirm new password").fill("Valid!Password2026");
  await page.getByRole("button", { name: "Reset password" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "This reset link is invalid or has expired." }),
  ).toBeVisible();
});

test("auth pages are translated and keep the reset token when switching language", async ({
  page,
}) => {
  await page.goto("/en/reset-password?token=abc123abc123abc123abc123");
  await page.getByRole("link", { name: "Kinyarwanda" }).click();
  await expect(page).toHaveURL(/\/rw\/reset-password\?token=abc123abc123abc123abc123$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Shyiraho ijambobanga rishya");
});
