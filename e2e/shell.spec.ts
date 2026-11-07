import { expect, test } from "@playwright/test";
import { DOCTOR_STATE } from "./helpers";

test.use({ storageState: DOCTOR_STATE });

test("root redirects to the localized dashboard inside the app shell", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en\/dashboard$/);
  await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  for (const label of ["Patients", "Staff", "Wards & Beds", "Transfers", "Audit Log"]) {
    await expect(nav.getByRole("link", { name: label })).toBeVisible();
  }
});

test("language switcher changes the UI language", async ({ page }) => {
  await page.goto("/en/dashboard");
  await page.getByRole("button", { name: "Language" }).click();
  await page.getByRole("menuitemradio", { name: "Français" }).click();

  await expect(page).toHaveURL(/\/fr\/dashboard$/);
  await expect(page.getByRole("heading", { level: 1, name: "Tableau de bord" })).toBeVisible();
});

test("the top bar shows the signed-in facility", async ({ page }) => {
  await page.goto("/en/dashboard");
  await expect(page.getByRole("banner")).not.toContainText("No facility selected");
});
