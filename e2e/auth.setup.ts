import { test as setup } from "@playwright/test";
import { DOCTOR_STATE, signIn } from "./helpers";

/** Signs in once and saves the session cookies for specs that only need a signed-in user. */
setup("sign in as the seeded doctor", async ({ page }) => {
  await signIn(page);
  await page.context().storageState({ path: DOCTOR_STATE });
});
