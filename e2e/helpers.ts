import { expect, type Page } from "@playwright/test";

/** Seeded development accounts; the password is SEED_DEFAULT_PASSWORD from the API's .env. */
export const SEEDED_PASSWORD = process.env.E2E_USER_PASSWORD ?? "ChangeMe!Dev2026";
export const DOCTOR = {
  email: process.env.E2E_USER_EMAIL ?? "doctor.chuk@rwhms.gov.rw",
  name: "Dr. Claire Mutoni",
};
/** Where the setup project saves the signed-in doctor session. */
export const DOCTOR_STATE = "e2e/.auth/doctor.json";

export const MULTI_FACILITY_DOCTOR = "doctor.multi@rwhms.gov.rw";

export async function signIn(page: Page, email = DOCTOR.email, password = SEEDED_PASSWORD) {
  await page.goto("/en/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  // The dev server compiles the destination page on first visit, which can take a while.
  await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
}
